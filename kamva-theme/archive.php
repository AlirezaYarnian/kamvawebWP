<?php
/**
 * Archive template
 * @package KamvaWeb
 */

get_header(); ?>

<main id="primary" class="site-main py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <header class="archive-header mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <h1 class="text-2xl font-black text-white"><?php the_archive_title(); ?></h1>
        <div class="text-xs text-slate-400 mt-2"><?php the_archive_description(); ?></div>
    </header>

    <?php if (have_posts()) : ?>
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
                        <h2 class="entry-title text-base font-bold text-white hover:text-indigo-400 transition-colors">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>
                        <div class="text-xs text-slate-300 line-clamp-2"><?php the_excerpt(); ?></div>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>
        <div class="mt-8 text-center"><?php the_posts_pagination(); ?></div>
    <?php endif; ?>
</main>

<?php get_footer();
