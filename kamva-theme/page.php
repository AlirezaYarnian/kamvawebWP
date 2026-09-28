<?php
/**
 * Page template
 * @package KamvaWeb
 */

get_header(); ?>

<main id="primary" class="site-main py-6 w-full">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('w-full'); ?>>
            <div class="entry-content">
                <?php the_content(); ?>
            </div>
        </article>
    <?php endwhile; ?>
</main>

<?php get_footer();
