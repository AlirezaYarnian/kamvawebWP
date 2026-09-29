<?php
/**
 * Single post template
 * @package KamvaWeb
 */

get_header(); ?>

<main id="primary" class="site-main py-10 max-w-4xl mx-auto px-4 sm:px-6">
    <?php while (have_posts()) : the_post(); 
        $word_count = count(preg_split('/\s+/u', wp_strip_all_tags(get_the_content()), -1, PREG_SPLIT_NO_EMPTY));
        $reading_time = max(1, ceil($word_count / 200));
    ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6'); ?>>
            <header class="entry-header space-y-3 border-b border-slate-800 pb-6">
                <div class="flex items-center gap-2 text-xs text-slate-400">
                    <span>نوشته شده در: <?php the_category(', '); ?></span>
                    <span>•</span>
                    <span>📅 <?php echo get_the_date(); ?></span>
                    <span>•</span>
                    <span>⏱ زمان مطالعه: حدود <?php echo esc_html($reading_time); ?> دقیقه (<?php echo esc_html($word_count); ?> کلمه)</span>
                </div>
                <h1 class="entry-title text-2xl sm:text-3xl font-black text-white leading-tight">
                    <?php the_title(); ?>
                </h1>
            </header>

            <?php if (has_post_thumbnail()) : ?>
                <div class="post-featured-image rounded-2xl overflow-hidden aspect-video">
                    <?php the_post_thumbnail('large', array('class' => 'w-full h-full object-cover')); ?>
                </div>
            <?php endif; ?>

            <div class="entry-content text-slate-200 leading-relaxed text-sm space-y-4">
                <?php the_content(); ?>
            </div>

            <footer class="entry-footer border-t border-slate-800 pt-6 flex items-center justify-between text-xs text-slate-400">
                <div class="author-info flex items-center gap-2">
                    <span class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        <?php echo esc_html(mb_substr(get_the_author(), 0, 1)); ?>
                    </span>
                    <span><?php esc_html_e('نویسنده:', 'kamvaweb'); ?> <strong><?php the_author(); ?></strong></span>
                </div>
                <div class="share-buttons flex items-center gap-2">
                    <span><?php esc_html_e('اشتراک‌گذاری در شبکه‌های اجتماعی', 'kamvaweb'); ?></span>
                </div>
            </footer>
        </article>

        <?php
        if (comments_open() || get_comments_number()) :
            comments_template();
        endif;
        ?>
    <?php endwhile; ?>
</main>

<?php get_footer();
