<?php
/**
 * The main template file for KamvaWeb Pro Theme
 * @package KamvaWeb
 */

get_header(); ?>

<main id="primary" class="site-main kamva-container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <?php if (have_posts()) : ?>
        <header class="page-header mb-8 text-center">
            <h1 class="page-title text-3xl font-black text-white"><?php bloginfo('name'); ?></h1>
            <p class="text-sm text-slate-400 mt-2"><?php bloginfo('description'); ?></p>
        </header>

        <div class="kamva-posts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all'); ?>>
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="post-thumbnail aspect-video overflow-hidden">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium_large', array('class' => 'w-full h-full object-cover hover:scale-105 transition-transform duration-300')); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div class="p-6 space-y-3">
                        <div class="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>📅 <?php echo get_the_date(); ?></span>
                            <span>•</span>
                            <span>✍️ <?php the_author(); ?></span>
                        </div>

                        <h2 class="entry-title text-lg font-bold text-white hover:text-indigo-400 transition-colors">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>

                        <div class="entry-summary text-xs text-slate-300 line-clamp-3 leading-relaxed">
                            <?php the_excerpt(); ?>
                        </div>

                        <a href="<?php the_permalink(); ?>" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 pt-2">
                            ادامه مطلب و مطالعه کامل &larr;
                        </a>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>

        <div class="kamva-pagination mt-10 text-center">
            <?php the_posts_pagination(array(
                'mid_size'  => 2,
                'prev_text' => 'صفحه قبل',
                'next_text' => 'صفحه بعد',
            )); ?>
        </div>

    <?php else : ?>
        <div class="no-results text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 class="text-xl font-bold text-white">مطلبی یافت نشد!</h2>
            <p class="text-xs text-slate-400 mt-2">به نظر می‌رسد هیچ نوشته یا محصولی در این بخش وجود ندارد.</p>
        </div>
    <?php endif; ?>
</main>

<?php get_footer();
