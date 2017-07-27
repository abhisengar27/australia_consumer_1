/**
 * Common Utils 
 */
declare var jQuery: any;

export class CommonUtils {

    /**
     * trim white spaces on keypress
     */ 
    static trimWhiteSpacesOnKeyPress() {
        jQuery('input[type=text],input[type=email]').keyup(function () {
            jQuery(this).val(jQuery(this).val().replace(/ +?/g, ''));
        });
    }

    /**
     * trim white spaces on blur
     */
    static trimWhiteSpacesOnBlur(){
       jQuery('input[type=email]').keyup(function(){
           jQuery(this).val(jQuery(this).val().replace(/ +?/g, ''));
       })
    }

    /**
     * Active progress animation
     */
    static activeProgressBar(){
        var total = 4;
        var current = parseInt(jQuery('.page-heading-mobile').attr('data-step'));
        var average  = (current/total)*100;
        var activePercent = average + '%';
        var progress = jQuery('.progress-bar');
        jQuery('.progress-bar').attr('data-progress1',average);
         progress.css('width',activePercent);
        this.activeMobileProgressBar(current);
    }

    /**
     * Completed progress bar by step number
     */
    static completedProgressBarStep(current){
        var total = 4;    
        var average  = (current/total)*100;
        var activePercent = average + '%';
        var progress = jQuery('.progress-bar2');
        jQuery('.progress-bar2').attr('data-progress2',average);
       // progress.css('width',activePercent);
        progress.animate({ width: activePercent }, { duration: 1500, easing: 'linear' })
    }

    
    /**
     * Active progress bar by step number
     */
    static activeProgressBarStep(current){
        var total = 4;
       // var current = parseInt(jQuery('.page-heading-mobile').attr('data-step'));
        var average  = (current/total)*100;
        var activePercent = average + '%';
        var progress = jQuery('.progress-bar');
        jQuery('.progress-bar').attr('data-progress1',average);
        //jQuery('.number-progress-bar ul').children().eq(current).addClass('completed');
        progress.css('width',activePercent);
        this.activeMobileProgressBar(current);
        //progress.animate({ width: activePercent }, { duration: 1500, easing: 'linear' })
    }


    /**
     * Mobile progress bar active
     */
    static activeMobileProgressBar(step) {
        var stepNumber = 0;

        if (step != 0) {
            stepNumber = step - 1;
        } else {
            stepNumber = 0;
        }

        jQuery('.number-progress-bar ul').children().find('span.stepvalue').eq(stepNumber).addClass('active');
        jQuery('.number-progress-bar ul').children().find('span.stepvalue').slice(0, step).addClass('active');

    }

    /**
     * Mobile progress bar completed
     */
    static completedMobileProgressBar(step) {
        var stepNumber = 0;
        if (step != 0) {
            stepNumber = step - 1;
        } else {
            stepNumber = 0;
        }

        jQuery('.number-progress-bar ul').children().find('span.stepvalue').eq(stepNumber).addClass('completed');
    }

    /**
     * remove active in mobile progress bar
     */
    static removeMobileProgressBar(step) {
        jQuery('.number-progress-bar ul').children().find('span.stepvalue').eq(step).removeClass('active');
    }


}