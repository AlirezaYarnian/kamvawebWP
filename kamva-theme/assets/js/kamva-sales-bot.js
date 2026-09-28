/**
 * KamvaWeb Sales Bot & Interactive AI Consultant Frontend Script
 */
(function($) {
    'use strict';

    window.KamvaSalesBot = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            $(document).on('click', '.kamvaweb-send-btn', this.handleSend.bind(this));
            $(document).on('keypress', '.kamvaweb-chat-input', function(e) {
                if (e.which === 13) {
                    e.preventDefault();
                    KamvaSalesBot.handleSend();
                }
            });
            $(document).on('click', '.kamvaweb-connect-consultant-btn', this.connectToHumanConsultant.bind(this));
        },

        handleSend: function() {
            var $input = $('.kamvaweb-chat-input');
            var message = $input.val().trim();
            if (!message) return;

            this.appendMessage('user', message);
            $input.val('');

            var $chatBox = $('.kamvaweb-chat-messages');
            var $typingIndicator = $('<div class="kamvaweb-msg ai-msg typing"><span class="animate-pulse">در حال بررسی پاسخ...</span></div>');
            $chatBox.append($typingIndicator);
            $chatBox.scrollTop($chatBox[0].scrollHeight);

            $.ajax({
                url: kamvaWebData.restUrl + 'chat',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ message: message }),
                success: function(res) {
                    $typingIndicator.remove();
                    var replyText = res.reply || 'پاسخ دریافت شد.';
                    var ctaHtml = '';

                    if (res.connectToConsultant) {
                        ctaHtml = '<div class="mt-3 text-right"><button class="kamvaweb-connect-consultant-btn bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md inline-flex items-center gap-1.5"><i class="dashicons dashicons-operator"></i> وصل شدن به مشاور فروشگاه</button></div>';
                    }

                    KamvaSalesBot.appendMessage('ai', replyText, ctaHtml);
                },
                error: function() {
                    $typingIndicator.remove();
                    var fallbackText = 'با سلام و احترام، متأسفانه در لحظه اتصال به پایگاه دانش خطایی رخ داده است. آیا مایل به ارتباط مستقیم با مشاور فروشگاه هستید؟';
                    var ctaHtml = '<div class="mt-3 text-right"><button class="kamvaweb-connect-consultant-btn bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md inline-flex items-center gap-1.5"><i class="dashicons dashicons-operator"></i> ارتباط با مشاور ارشد فروش</button></div>';
                    KamvaSalesBot.appendMessage('ai', fallbackText, ctaHtml);
                }
            });
        },

        appendMessage: function(sender, text, extraCta) {
            var $chatBox = $('.kamvaweb-chat-messages');
            var msgClass = sender === 'user' ? 'user-msg text-right bg-indigo-600 text-white' : 'ai-msg text-right bg-slate-800 text-slate-100 border border-slate-700';
            var html = '<div class="kamvaweb-msg p-3.5 rounded-2xl mb-2.5 text-xs shadow-sm ' + msgClass + '">' +
                        '<div class="msg-content">' + this.escapeHtml(text) + '</div>' +
                        (extraCta || '') +
                       '</div>';
            $chatBox.append(html);
            if ($chatBox.length) {
                $chatBox.scrollTop($chatBox[0].scrollHeight);
            }
        },

        connectToHumanConsultant: function(e) {
            e.preventDefault();
            alert('در حال انتقال شما به مشاور فروشگاه... همکاران ما در واحد پشتیبانی و فروش تا چند لحظه دیگر پاسخگوی شما خواهند بود.');
        },

        escapeHtml: function(string) {
            return String(string).replace(/[&<>"']/g, function(s) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[s];
            });
        }
    };

    $(document).ready(function() {
        KamvaSalesBot.init();
    });
})(jQuery);
