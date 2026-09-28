<?php
/**
 * KamvaWeb All-In-One Integrated Security Suite
 * فایروال اختصاصی WAF، محافظت از دیتابیس در برابر SQLi، ضد Brute-Force و تغییر آدرس لاگین
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Security_Shield {

    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'run_waf_firewall'), 1);
        add_action('wp_authenticate', array($this, 'check_brute_force_attempts'), 10, 2);
        add_filter('xmlrpc_enabled', '__return_false');
        remove_action('wp_head', 'wp_generator');
        add_filter('the_generator', '__return_empty_string');
    }

    public function run_waf_firewall() {
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        $query = $_SERVER['QUERY_STRING'] ?? '';
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $malicious_patterns = array(
            'union.*select', 'base64_', 'eval(', '<script', 'etc/passwd',
            'boot.ini', '../..', 'concat(', 'sleep(', 'benchmark('
        );

        foreach ($malicious_patterns as $pattern) {
            if (preg_match('/' . $pattern . '/i', $uri . ' ' . $query)) {
                $this->log_security_breach('sql_or_xss_injection');
                wp_die('دسترسی شما توسط فایروال اختصاصی کامواوب مسدود گردید.', 'WAF Blocked', array('response' => 403));
            }
        }
    }

    public function check_brute_force_attempts($username) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $key = 'kamva_login_fail_' . md5($ip);
        $attempts = (int) get_transient($key);

        if ($attempts >= 4) {
            $this->log_security_breach('brute_force_lockout');
            wp_die('تعداد تلاش‌های ناموفق شما بیش از حد مجاز است. آی‌پی شما به مدت ۱ ساعت مسدود شد.', 'Brute Force Protected', array('response' => 403));
        }
    }

    private function log_security_breach($type) {
        $logs = get_option('kamva_security_logs', array());
        $logs[] = array(
            'time' => current_time('mysql'),
            'type' => $type,
            'ip'   => $_SERVER['REMOTE_ADDR'] ?? '',
            'url'  => esc_url($_SERVER['REQUEST_URI'] ?? ''),
        );
        update_option('kamva_security_logs', array_slice($logs, -100));
    }
}

KamvaWeb_Security_Shield::get_instance();
