(function($) {
    var _errorElement;
    var defaults = {
        /**
         * When set to true, input fields will not be disabled
         */
        debug: false,
        /**
         * Defaults to form action URL
         */
        submitUrl: '',
        /**
         * Defaults to form action URL
         */
        redirectUrl: '',
        /**
         * Input fields to be checked for errors
         */
        inputsSelector: 'input, select, textarea',
        /**
         * Input wrapper selector
         * error/success classes will be added to this element
         */
        inputWrapperSelector: '.form-group',
        /**
         * Success class, will be added to inputs that were validated successfully
         */
        successClass: 'has-success',
        /**
         * Error class, will be added to inputs that had errors
         */
        errorClass: 'has-error',
        /**
         * Element containing error message, will be appended after inputs
         * Class is mandatory
         */
        errorElement: '<div class="form-error"></div>',
        /**
         * Called when input has an error
         *
         * @param $input    jQuery object with input that has an error
         * @param errors    array with error messages
         * @param $form     jQuery object with form
         */
        onError: function($input, errors, $form) {
            $input.nextAll('.' + _errorElement.attr('class')).remove();
            $input.parents(defaults.inputWrapperSelector).removeClass(defaults.successClass).addClass(defaults.errorClass);
            $.each(errors, function(i, error) {
                if($input.attr('type') !== 'hidden') {
                    $input.after(_errorElement.clone().html(error));
                }
            });
        },
        /**
         * Called when input is valid
         *
         * @param $input    jQuery object with input that is valid
         * @param $form     jQuery object with form
         */
        onValid: function($input, $form) {
            $input.nextAll('.' + _errorElement.attr('class')).remove();
            $input.parents(defaults.inputWrapperSelector).removeClass(defaults.errorClass).addClass(defaults.successClass);
        },
        /**
         * Called before the form data is sent to server to be validated, also, this is called
         * after the form data has been serialized
         * Usually used for disabling input fields to let the user know, that the form has
         * been submitted
         *
         * @param $form     jQuery object with form
         */
        beforeValidation: function($form) {
            if(!defaults.debug) {
                $form.find(defaults.inputsSelector).attr('disabled', 'disabled');
            }
        },
        /**
         * Called after response with validation is received from the server
         * Checks if there were any errors and then either calls onError and onValid for each
         * form input field (using the defaults.inputsSelector)
         * If the validation was successful defaults.beforeRedirect is called and then the user
         * is redirected to defaults.redirectUrl
         *
         * @param data      validation data
         * @param $form     jQuery object with form
         */
        onValidationReceived: function(data, $form) {
            if(!defaults.debug) {
                $form.find(defaults.inputsSelector).removeAttr('disabled');
            } else {
                console.log(data);
            }
            if(data.success) {
                defaults.beforeRedirect($form);
                location.href = defaults.redirectUrl;
            } else {
                $form.find(defaults.inputsSelector).each(function(i, input) {
                    var $input = $(input);
                    var inputName = $input.attr('name');
                    if(data.errors.hasOwnProperty(inputName)) {
                        defaults.onError($input, data.errors[inputName], $form);
                    } else {
                        defaults.onValid($input, $form);
                    }
                });
            }
        },
        /**
         * Called when the validation is successful
         *
         * @param form      jQuery object with form
         */
        beforeRedirect: function($form) {
        }
    };

    /**
     * Initialize ajax validation
     *
     * @param options   options
     * @param $form     jQuery object with form
     * @returns         jQuery object with form
     */
    function init(options, $form) {
        defaults.submitUrl = $form.attr('action');
        defaults.redirectUrl = defaults.submitUrl;
        $.extend(defaults, options);
        _errorElement = $(defaults.errorElement);
        if(typeof _errorElement.attr('class') === 'undefined') {
            console.error('Error element class is mandatory: ' + defaults.errorElement);
            return $form;
        }
        var ajaxFormOptions = {
            url: defaults.submitUrl,
            beforeSend: function() {
                defaults.beforeValidation($form);
            },
            success: function(data) {
                $form.data('submitted', false);
                defaults.onValidationReceived(data, $form);
            }
        };
        $form.on('submit', function onFormSubmit(e) {
            e.preventDefault();
            //prevent double submit in some browsers
            if(!$form.data('submitted')) {
                $form.ajaxSubmit(ajaxFormOptions);
                $form.data('submitted', true);
            }
            return false;
        });
        return $form;
    }

    $.fn.ajaxValidate = function(options) {
        var $form = this;
        if(!$form.is('form')) {
            console.error('Element is not a form', $form);
            return $form;
        }
        if(typeof options === 'string') {
            return actions(options, $form);
        } else {
            return init(options, $form);
        }
    };
}(jQuery));
