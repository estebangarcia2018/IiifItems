/** IiifItems endpoint **/
(function($) {
    $.IiifItemsAnnotations = function(options) {
        jQuery.extend(this, {
            token:     null,
            prefix:    null,
            dfd:       null,
            annotationsList: [],        
            windowID: null,
            eventEmitter: null
        }, options);

        this.init();
    };

    $.IiifItemsAnnotations.prototype = {
        init: function() { 		  
        },
        
        set: function(prop, value, options) {
            if (options) {
                this[options.parent][prop] = value;
            } else {
                this[prop] = value;
            }
        },
        
        search: function(options, successCallback, errorCallback) {
            var _this = this;
            this.annotationsList = []; //clear out current list

            jQuery.ajax({
                url: this.prefix + '/index',
                type: 'GET',
                dataType: 'json',
                headers: {},
                data: {
                    uri: options.uri
                },
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    jQuery.each(data, function(index, value) {
                        value.endpoint = _this;
                        _this.annotationsList.push(value);
                    });
                    if (typeof successCallback === "function") {
                        successCallback(_this.annotationsList);
                    } else {
                        _this.dfd.resolve(true);
                    }
                },
                error: function() {
                    if (typeof errorCallback === "function") {
                        errorCallback();
                    }
                }
            });
        },
        
        deleteAnnotation: function(annotationID, successCallback, errorCallback) {
            var _this = this;
            jQuery.ajax({
                url: this.prefix + "/delete",
                type: 'DELETE',
                dataType: 'json',
                headers: {},
                data: JSON.stringify({
                    'id': annotationID,
                }),
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    if (typeof errorCallback === "function") {
                        successCallback();
                    }
                },
                error: function() {
                    if (typeof errorCallback === "function") {
                        errorCallback();
                    }
                }
            });
        },

        update: function(oaAnnotation, successCallback, errorCallback) {
            var _this = this;
            delete oaAnnotation.endpoint;
            jQuery.ajax({
                url: this.prefix + '/update',
                type: 'PUT',
                dataType: 'json',
                headers: {},
                data: JSON.stringify(oaAnnotation),
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    data.endpoint = _this;
                    if (typeof successCallback === "function") {
                        successCallback(data);
                    }
                },
                error: function() {
                    if (typeof errorCallback === "function") {
                        errorCallback();
                    }
                }  
            });
        },

        //takes OA Annotation, gets Endpoint Annotation, and saves
        //if successful, MUST return the OA rendering of the annotation
        create: function(oaAnnotation, successCallback, errorCallback) {
            var _this = this;

            jQuery.ajax({
                url: this.prefix,
                type: "POST",
                dataType: "json",
                headers: {},
                data: JSON.stringify(oaAnnotation),
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    if (typeof successCallback === "function") {
                        successCallback(data);
                    }
                    data.endpoint = _this;
                },
                error: function() {
                    if (typeof errorCallback === "function") {
                        errorCallback();
                    }
                }  
            });
        },

        getAnnotationList: function(key) {
            var data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            } else {
                return [];
            }
        },

        userAuthorize: function(action, annotation) {
            return true;
        }
    };
}(Mirador));

