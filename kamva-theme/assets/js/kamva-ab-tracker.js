/**
 * KamvaWeb NexusAI - Client-side A/B Telemetry Tracker
 * Tracks impressions, clicks on CTA, dwell time and conversions without blocking render.
 */
(function($) {
  'use strict';

  $(document).ready(function() {
    var $abContainers = $('.kamva-ab-container');
    if (!$abContainers.length) return;

    $abContainers.each(function() {
      var $section = $(this);
      var expId = $section.data('ab-experiment');
      var variant = $section.data('ab-variant');
      var startTime = Date.now();

      // Track Impression
      sendABEvent(expId, variant, 'impression');

      // Track CTA clicks
      $section.find('[data-ab-action="conversion"]').on('click', function(e) {
        sendABEvent(expId, variant, 'conversion');
      });

      $section.find('[data-ab-action="secondary_click"]').on('click', function(e) {
        sendABEvent(expId, variant, 'click');
      });

      // Track Dwell Time on visibility change / unload
      window.addEventListener('beforeunload', function() {
        var duration = Math.round((Date.now() - startTime) / 1000);
        if (duration > 2) {
          if (navigator.sendBeacon && window.kamvaABConfig && window.kamvaABConfig.restUrl) {
            navigator.sendBeacon(
              window.kamvaABConfig.restUrl + 'event',
              JSON.stringify({
                experiment_id: expId,
                variant: variant,
                event_type: 'dwell',
                dwell_seconds: duration
              })
            );
          }
        }
      });
    });

    function sendABEvent(expId, variant, eventType) {
      if (!window.kamvaABConfig || !window.kamvaABConfig.restUrl) return;

      fetch(window.kamvaABConfig.restUrl + 'event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.kamvaABConfig.nonce || ''
        },
        body: JSON.stringify({
          experiment_id: expId,
          variant: variant,
          event_type: eventType
        }),
        keepalive: true
      }).catch(function(err) {
        // silent fail for analytics
      });
    }
  });
})(jQuery);
