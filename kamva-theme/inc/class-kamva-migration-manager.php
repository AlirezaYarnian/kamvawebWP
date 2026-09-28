<?php
/**
 * KamvaMigrationManager - Custom Database Migration & Schema Manager for NexusAI
 * 
 * Manages custom tables creation, schema versioning, updates, and integrity checks 
 * for NexusAI crawler, customer behavior, and slow queries.
 *
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaMigrationManager {

    private static $instance = null;
    private $db_version_key = 'kamvaweb_db_schema_version';
    private $current_schema_version = '1.3.0'; // Target schema version

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Run database migrations on admin init or switch theme hook
        add_action('admin_init', array($this, 'maybe_run_migrations'));
        add_action('after_switch_theme', array($this, 'force_migration_on_activation'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    /**
     * Force runs custom schema migrations on theme activation
     */
    public function force_migration_on_activation() {
        $this->run_migrations();
    }

    /**
     * Runs migrations if schema version stored in options is outdated
     */
    public function maybe_run_migrations() {
        $installed_ver = get_option($this->db_version_key, '0.0.0');
        if (version_compare($installed_ver, $this->current_schema_version, '<')) {
            $this->run_migrations();
        }
    }

    /**
     * Main schema creation using dbDelta
     */
    public function run_migrations() {
        global $wpdb;

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $charset_collate = $wpdb->get_charset_collate();

        // Table 1: Storing Web Crawled Content & Local Knowledge Base
        $table_crawls = $wpdb->prefix . 'kamva_nexus_ai_crawls';
        $sql_crawls = "CREATE TABLE {$table_crawls} (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            url varchar(255) NOT NULL,
            title varchar(255) DEFAULT '' NOT NULL,
            summary text DEFAULT '' NOT NULL,
            price varchar(50) DEFAULT '' NOT NULL,
            keywords varchar(255) DEFAULT '' NOT NULL,
            category varchar(50) DEFAULT 'product' NOT NULL,
            status varchar(20) DEFAULT 'active' NOT NULL,
            created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            updated_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY url (url)
        ) {$charset_collate};";

        // Table 2: Customer Behavioral Analytics & CRO Logs
        $table_behavior = $wpdb->prefix . 'kamva_nexus_ai_behavior';
        $sql_behavior = "CREATE TABLE {$table_behavior} (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            session_id varchar(100) NOT NULL,
            click_path text DEFAULT '' NOT NULL,
            dwell_times text DEFAULT '' NOT NULL,
            bounce_rate varchar(10) DEFAULT '' NOT NULL,
            cro_score int(11) DEFAULT 0 NOT NULL,
            personalized_offer text DEFAULT '' NOT NULL,
            created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            PRIMARY KEY  (id)
        ) {$charset_collate};";

        // Table 3: Database Query Performance Optimizer Logs
        $table_slow_queries = $wpdb->prefix . 'kamva_nexus_ai_slow_queries';
        $sql_slow_queries = "CREATE TABLE {$table_slow_queries} (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            query_hash varchar(32) NOT NULL,
            sql_text text NOT NULL,
            execution_time_ms float DEFAULT 0 NOT NULL,
            page_context varchar(150) DEFAULT '' NOT NULL,
            caller varchar(150) DEFAULT '' NOT NULL,
            index_suggestion text DEFAULT '' NOT NULL,
            applied tinyint(1) DEFAULT 0 NOT NULL,
            created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY query_hash (query_hash)
        ) {$charset_collate};";

        // Execute queries safely using standard dbDelta
        dbDelta($sql_crawls);
        dbDelta($sql_behavior);
        dbDelta($sql_slow_queries);

        // Update DB version in options
        update_option($this->db_version_key, $this->current_schema_version);
    }

    /**
     * Verify database table structure integrity
     */
    public function check_tables_integrity() {
        global $wpdb;

        $tables = array(
            'kamva_nexus_ai_crawls',
            'kamva_nexus_ai_behavior',
            'kamva_nexus_ai_slow_queries'
        );

        $integrity_report = array();

        foreach ($tables as $tbl) {
            $full_tbl_name = $wpdb->prefix . $tbl;
            $exists = $wpdb->get_var("SHOW TABLES LIKE '{$full_tbl_name}'") === $full_tbl_name;
            
            $integrity_report[$tbl] = array(
                'table_name' => $full_tbl_name,
                'exists'     => $exists,
                'rows'       => $exists ? intval($wpdb->get_var("SELECT COUNT(*) FROM {$full_tbl_name}")) : 0,
            );
        }

        return $integrity_report;
    }

    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        register_rest_route('kamvaweb/v1', '/migrations', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_migrations_status'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('kamvaweb/v1', '/run-migrations', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'trigger_migrations_manually'),
            'permission_callback' => '__return_true',
        ));
    }

    public function get_migrations_status($request) {
        $integrity = $this->check_tables_integrity();
        $installed_ver = get_option($this->db_version_key, '0.0.0');

        return new WP_REST_Response(array(
            'success'                => true,
            'installed_version'      => $installed_ver,
            'target_version'         => $this->current_schema_version,
            'migrations_up_to_date' => version_compare($installed_ver, $this->current_schema_version, '>='),
            'tables_integrity'       => $integrity,
        ), 200);
    }

    public function trigger_migrations_manually($request) {
        $this->run_migrations();
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'جداول و ساختار دیتابیس قالب کامواوب با موفقیت بروزرسانی و بازسازی شدند.',
            'version' => $this->current_schema_version,
            'tables'  => $this->check_tables_integrity()
        ), 200);
    }
}

KamvaMigrationManager::get_instance();
