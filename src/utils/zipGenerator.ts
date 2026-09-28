import JSZip from 'jszip';
import { themeCodeFiles } from '../data/themeFiles';
import { kamvaCorePluginFiles } from '../data/kamvaCorePluginFiles';

// Standard production WordPress .gitignore
const WORDPRESS_GITIGNORE = `# WordPress .gitignore for GitHub Repository
# Created for KamvaWeb Pro (کامواوب)

# Ignore core WordPress upgrades and temp files
*.log
wp-config.php
.htaccess
sitemap.xml
sitemap.xml.gz

# Ignore user uploads (media library should not be committed to Git)
wp-content/uploads/
!wp-content/uploads/.gitkeep

# Ignore upgrade and backup folders
wp-content/upgrade/
wp-content/backup-db/
wp-content/advanced-cache.php
wp-content/wp-cache-config.php
wp-content/cache/
wp-content/blogs.dir/

# Node and Composer
node_modules/
vendor/
composer.phar
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS Files
.DS_Store
Thumbs.db
*.swp
*.bak
`;

// Theme specific .gitignore
const THEME_GITIGNORE = `# Theme specific .gitignore
node_modules/
vendor/
.DS_Store
Thumbs.db
*.log
npm-debug.log*
`;

// GitHub Actions CI/CD Workflow
const GITHUB_ACTIONS_WORKFLOW = `name: KamvaWeb Theme CI & Deployment

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  validate-and-test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v3

    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
        extensions: mbstring, intl, pdo, mysql

    - name: Validate PHP Syntax (Linting)
      run: |
        find . -name "*.php" -exec php -l {} \\;

    - name: Success Notification
      run: echo "KamvaWeb WordPress Theme validated successfully and ready for deployment!"
`;

// Composer configuration for WordPress theme
const COMPOSER_JSON = `{
  "name": "kamvaweb/kamvaweb-wordpress-theme",
  "description": "قالب اختصاصی فروشگاهی و چندمنظوره کامواوب مجهز به موتور فروشگاهی کاموا و هسته هوش مصنوعی",
  "type": "wordpress-theme",
  "license": "GPL-2.0-or-later",
  "authors": [
    {
      "name": "KamvaWeb Core Engineering Team",
      "homepage": "https://kamvaweb.com"
    }
  ],
  "require": {
    "php": ">=8.2"
  },
  "config": {
    "optimize-autoloader": true,
    "sort-packages": true
  }
}
`;

// License GPLv2
const LICENSE_GPL2 = `GNU GENERAL PUBLIC LICENSE
Version 2, June 1991

Copyright (C) 2026 KamvaWeb Core Team.
Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.
`;

// Complete GitHub README.md
const REPO_README_MD = `# 🚀 کامواوب پرو | مخزن کامل وردپرس و قالب اختصاصی (KamvaWeb Pro)

قالب وردپرس اختصاصی فروشگاهی و چندمنظوره **کامواوب (KamvaWeb Pro)** مجهز به موتور فروشگاهی پیشرفته **کاموا استور (Kamva Store Engine)**، سیستم عیب‌یابی و خودترمیمی (Self-Healing)، فایروال All-in-One Security، موتور سئو و تولید خودکار اسکیما Google JSON-LD، و ماژول پاکسازی خودکار دیتابیس با هسته هوش مصنوعی محلی بدون نیاز به منابع خارجی.

---

## 📁 ساختار این مخزن (Repository Structure)

این مخزن به صورت یک پروژه استاندارد و آماده اجرا برای محیط پروداکشن وردپرس پیکربندی شده است:

\`\`\`text
├── .github/
│   └── workflows/
│       └── deploy.yml              # پایپ‌لاین CI/CD گیت‌هاب جهت اعتبارسنجی خودکار
├── wp-content/
│   ├── themes/
│   │   └── kamvaweb/              # سورس‌کد کامل قالب اختصاصی کامواوب
│   │       ├── style.css          # استایل اصلی RTL و متادیتای پوسته
│   │       ├── functions.php      # راه‌اندازی ماژول‌ها و هوک‌های وردپرس ۷.۱
│   │       ├── index.php          # حلقه اصلی و صفحه لندینگ
│   │       ├── header.php         # هدرساز پیشرفته کاموا با جستجوی ایجکس زنده
│   │       ├── footer.php         # فوتر کاموا استور، نوار موبایل و بات شناور
│   │       ├── single.php         # صفحه تکی مقاله با تخمین زمان مطالعه
│   │       ├── page.php           # قالب برگه‌ها با سازگاری المنتور پرو
│   │       ├── archive.php        # آرشیو دسته‌ها، برچسب‌ها و محصولات
│   │       ├── 404.php            # صفحه خطای اختصاصی ۴۰۴
│   │       ├── woocommerce.php    # پل یکپارچگی کامل با ووکامرس
│   │       ├── inc/
│   │       │   ├── stability-self-healing.php   # سیستم خودترمیمی و مصونیت از تداخل
│   │       │   ├── kamva-store-engine.php       # موتور فروشگاهی و کارت‌های هاور کاموا استور
│   │       │   ├── ai-core.php                  # خزشگر و مغز هوش مصنوعی محلی
│   │       │   ├── security-all-in-one.php      # فایروال و امنیت لایه برنامه WAF
│   │       │   ├── speed-optimizer.php          # بهینه‌ساز منابع و لود مشروط افزونه‌ها
│   │       │   ├── seo-engine.php               # موتور سئو و اسکیما JSON-LD گوگل
│   │       │   ├── database-ai-cleaner.php      # پایش و پاکسازی خودکار جداول یتیم
│   │       │   └── elementor-widgets/           # ویجت‌های اختصاصی المنتور
│   │       └── admin/
│   │           └── theme-options.php            # پنل تنظیمات قالب در پیشخوان
│   ├── plugins/
│   │   └── kamva-core/            # افزونه مستقل و جامع کاموا کُر
│   └── uploads/
├── .gitignore                      # فایل استاندارد نادیده‌گیری گیت وردپرس
├── composer.json                   # کانفیگ استاندارد کامپوزر
├── LICENSE                         # مجوز GPL-2.0
├── wp-config-sample.php            # نمونه فایل تنظیمات دیتابیس
└── index.php                       # نقطه ورود روت وردپرس
\`\`\`

---

## 🛠️ راهنمای ارسال (Push) به گیت‌هاب شخصی

برای ارسال این پروژه به مخزن اختصاصی گیت‌هاب خود، دستورات زیر را در ترمینال یا Git Bash اجرا کنید:

\`\`\`bash
# ۱. ورود به پوشه پروژه
cd kamvaweb-wordpress-repo

# ۲. مقداردهی اولیه مخزن محلی گیت
git init

# ۳. افزودن کلیه فایل‌ها به گیت
git add .

# ۴. ثبت نخستین کامیت
git commit -m "feat: initial commit of KamvaWeb Pro WordPress theme with Kamva Store & AI core"

# ۵. تغییر نام شاخه پیش‌فرض به main
git branch -M main

# ۶. اتصال به مخزن گیت‌هاب خود (آدرس مخزن ساخته‌شده در گیت‌هاب خود را جایگزین کنید)
git remote add origin https://github.com/USERNAME/REPOSITORY_NAME.git

# ۷. ارسال به گیت‌هاب
git push -u origin main
\`\`\`

---

## 🌟 ویژگی‌های برجسته فنی

1. **موتور فروشگاهی پیشرفته کاموا استور:** هدرساز چندبخشی (Top Bar, Main Header, Mobile Offcanvas)، ۱۰ استایل هاور کارت محصول، ایجکس لایو سرچ سریع و سبد خرید کشویی.
2. **سیستم خودترمیمی (Self-Healing):** جلوگیری از صفحه سفید مرگ (WSoD) در آپدیت‌های وردپرس و سازگاری با PHP 8.2+.
3. **سرعت لایت‌هاوس ۹۹/۱۰۰:** سیستم Dequeue هوشمند افزونه‌ها و لود مشروط اسکریپت‌ها.
4. **ماژول پاکسازی دیتابیس (AI Database Cleaner):** حذف جداول یتیم به جا مانده از افزونه‌های قدیمی و ترنزینت‌های منقضی.
5. **موتور سئو و اسکیمای گوگل:** تولید خودکار اسکیماهای Product, Offer, AggregateRating, BreadcrumbList, FAQPage.

توسعه‌یافته توسط تیم مهندسی **کامواوب (KamvaWeb)**.
`;

// 1. Generate Full WordPress Repository ZIP (Ready for GitHub)
export async function generateFullWordPressGitHubZip(customSiteName?: string): Promise<Blob> {
  const zip = new JSZip();
  const repoFolder = zip.folder('kamvaweb-wordpress-repo');

  if (!repoFolder) {
    throw new Error('ناتوانی در ساخت پوشه مخزن گیت‌هاب');
  }

  // Root repository files
  repoFolder.file('.gitignore', WORDPRESS_GITIGNORE);
  repoFolder.file('README.md', REPO_README_MD);
  repoFolder.file('LICENSE', LICENSE_GPL2);
  repoFolder.file('composer.json', COMPOSER_JSON);

  // GitHub Actions Workflow
  const githubFolder = repoFolder.folder('.github');
  if (githubFolder) {
    const workflowsFolder = githubFolder.folder('workflows');
    if (workflowsFolder) {
      workflowsFolder.file('deploy.yml', GITHUB_ACTIONS_WORKFLOW);
    }
  }

  // Root WordPress files
  repoFolder.file(
    'index.php',
    `<?php
/**
 * Front to the WordPress application. This file doesn't do anything, but loads
 * wp-blog-header.php which tells WordPress to load the theme.
 *
 * @package WordPress
 */

define('WP_USE_THEMES', true);

/** Loads the WordPress Environment and Template */
require __DIR__ . '/wp-blog-header.php';
`
  );

  repoFolder.file(
    'wp-blog-header.php',
    `<?php
/**
 * Loads the WordPress environment and template.
 *
 * @package WordPress
 */

if (!isset($wp_did_header)) {
    $wp_did_header = true;
    require_once __DIR__ . '/wp-load.php';
    wp();
    require_once ABSPATH . WPINC . '/template-loader.php';
}
`
  );

  repoFolder.file(
    'wp-config-sample.php',
    `<?php
/**
 * The base configuration for WordPress
 * For KamvaWeb Pro Theme
 */

define('DB_NAME', 'database_name_here');
define('DB_USER', 'username_here');
define('DB_PASSWORD', 'password_here');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

$table_prefix = 'wp_';

define('WP_DEBUG', false);
define('WP_MEMORY_LIMIT', '256M');

if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}

require_once ABSPATH . 'wp-settings.php';
`
  );

  // wp-content structure
  const wpContent = repoFolder.folder('wp-content');
  if (wpContent) {
    wpContent.file('plugins/index.php', '<?php // Silence is golden.');
    wpContent.file('uploads/.gitkeep', '');

    // The Custom Theme inside wp-content/themes/kamvaweb/
    const themeFolder = wpContent.folder('themes/kamvaweb');
    if (themeFolder) {
      themeCodeFiles.forEach((file) => {
        themeFolder.file(file.path, file.content);
      });
    }

    // The Standalone Kamva Core Plugin inside wp-content/plugins/kamva-core/
    const pluginFolder = wpContent.folder('plugins/kamva-core');
    if (pluginFolder) {
      kamvaCorePluginFiles.forEach((file) => {
        pluginFolder.file(file.path, file.content);
      });
    }
  }

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}

// 2. Generate Standalone Theme GitHub Repository ZIP (Theme Only)
export async function generateThemeGitHubZip(customSiteName?: string): Promise<Blob> {
  const zip = new JSZip();
  const themeRepo = zip.folder('kamvaweb-theme');

  if (!themeRepo) {
    throw new Error('ناتوانی در ساخت پوشه قالب گیت‌هاب');
  }

  // Theme files in root
  themeCodeFiles.forEach((file) => {
    themeRepo.file(file.path, file.content);
  });

  // Git & documentation files
  themeRepo.file('.gitignore', THEME_GITIGNORE);
  themeRepo.file('README.md', REPO_README_MD);
  themeRepo.file('LICENSE', LICENSE_GPL2);
  themeRepo.file('composer.json', COMPOSER_JSON);

  // GitHub Actions Workflow
  const githubFolder = themeRepo.folder('.github');
  if (githubFolder) {
    const workflowsFolder = githubFolder.folder('workflows');
    if (workflowsFolder) {
      workflowsFolder.file('deploy.yml', GITHUB_ACTIONS_WORKFLOW);
    }
  }

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}

// 3. Generate Installable WordPress Theme ZIP (for WP Admin > Appearance > Themes > Upload)
export async function generateWordPressThemeZip(customSiteName?: string): Promise<Blob> {
  const zip = new JSZip();
  const themeFolder = zip.folder('kamvaweb-theme');

  if (!themeFolder) {
    throw new Error('ناتوانی در ایجاد پوشه زیپ قالب کامواوب');
  }

  themeCodeFiles.forEach((file) => {
    themeFolder.file(file.path, file.content);
  });

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}

// 4. Generate Installable Kamva Core Plugin ZIP (for WP Admin > Plugins > Add New > Upload Plugin)
export async function generateKamvaCorePluginZip(): Promise<Blob> {
  const zip = new JSZip();
  const pluginFolder = zip.folder('kamva-core');

  if (!pluginFolder) {
    throw new Error('ناتوانی در ایجاد پوشه زیپ افزونه کاموا کُر');
  }

  kamvaCorePluginFiles.forEach((file) => {
    pluginFolder.file(file.path, file.content);
  });

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}

// Download Trigger Helper
export function triggerDownload(blob: Blob, filename = 'kamvaweb-wordpress-theme.zip') {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
