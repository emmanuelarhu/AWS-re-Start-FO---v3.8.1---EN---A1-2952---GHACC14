/*
 * Fuel UX Tree
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

(function($, undefined) {
    
    //var $ = require('jquery');
    
    // TREE CONSTRUCTOR AND PROTOTYPE
    
    var Tree = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.tree.defaults, options);

        this.$element.on('click', '.tree-item', 
            $.proxy(function(ev) {
                if (ev.target.className.indexOf("voc-tree-help") > 0) {
                 return;
                }
                this.selectItem(ev.currentTarget, ev.shiftKey);
            }, this));

        this.$element.on('click', '.tree-folder-header > [class*="icon-"]:first-child', 
            $.proxy(function(ev) {
                if (ev.target.className.indexOf("voc-tree-help") > 0) {
                 return;
                }
             this.openFolder($(ev.currentTarget).parent());
             ev.stopPropagation(); // prevent 'selectedfolder' handler from being triggered when event is bubbled up
            }, this));

        this.$element.on('click', '.tree-folder-header', 
            $.proxy(function(ev) {
                if (ev.target.className.indexOf("voc-tree-help") > 0) {
                 return;
                }
             this.selectFolder(ev.currentTarget, ev.shiftKey);
            }, this));
        
        this.render();
    };
 
    Tree.prototype = {
        constructor: Tree,
        
        render: function() {
            this.populate(this.$element);
        },
        
        populate: function($el) {
            var self = this;
            var loader = $el.parent().find('.tree-loader:eq(0)');
            
            loader.show();
            this.options.dataSource.data($el.data(), function(items) {
                loader.hide();
                
                $.each(items.data, function(index, value) {
                    var $entity;
                    var txtEl = "span";
                    var txtElAttr = ' class="tree-btn" tabindex="0" role="button"';
                    //var txtEl = "a";
                    //var txtElAttr = ' class="tree-btn" style="text-decoration:none;" tabindex="0" role="button"';
			        var thisname;
                    
                    if (value.type === "folder") {
                        $entity = self.$element.find('.tree-folder:eq(0)').clone().show();
                        if ( txtEl.length > 0 ) {
                            thisname = '<' + txtEl + txtElAttr + '>' + value.name + '</'+txtEl+'>';
						} else {
			                thisname = value.name;
			            }
                        var fn = $entity.find('.tree-folder-name');
                        if (value['ed'] == "0") {
                            var tmpmodalname = (value.name).replace(/(:|'|"|\.|\[|\]|,)/g, "\\$1") + "-help-modal";
                            if ( txtEl.length > 0 ) {
                            	thisname = '<' + txtEl + txtElAttr + '><b>' + value.name + '</b></'+txtEl+'>';
			                } else {
                                thisname = "<b>" + value.name + "</b>";
			                }
                            try {
                                if ($('body').find('#' + tmpmodalname).length > 0) {
                                    thisname += '<a class="badge badge-info pointer pull-right voc-tree-help tree-btn" tabindex="0" role="button" style="margin-right: 20px;" data-target="#' + tmpmodalname + '" data-toggle="modal">?</a>';
                                }
                            } catch (err) {
                                console.log("Folder exception: " + err);
                            }
                        }
                        
                        var tmpStr = '';
                        if ('extraHtml' in value) {
                            // not used yet
                            tmpStr = value['extraHtml'] + tmpStr;
                        }
                        fn.html(thisname + tmpStr);
                        
                        $entity.find('.tree-loader').html(self.options.loadingHTML);
                        var header = $entity.find('.tree-folder-header');
                        header.data(value);
                        if ('icon-class' in value)
                            header.find('[class*="icon-"]').addClass(value['icon-class']);

                    } else if (value.type === "item") {
                        $entity = self.$element.find('.tree-item:eq(0)').clone().show();
                        if (txtEl.length > 0 ) {
                            thisname = '<' + txtEl + txtElAttr + '>' + value.name + '</'+txtEl+'>';
						} else {
							thisname = value.name;
						}
						if (value['ed'] == "0") {
							var tmpmodalname = (value.name).replace(/(:|'|"|\.|\[|\]|,)/g, "\\$1") + "-help-modal";
							if (txtEl.length > 0 ) {
                            	//thisname = '<' + txtEl + txtElAttr + '><b>' + value.name + '</b></'+txtEl+'>';
							} else {
								//thisname =  "<b>" + value.name + "</b>";
							}   
							try {
								if ($('body').find('#' + tmpmodalname).length > 0) {
									thisname += '<a class="badge badge-info pointer pull-right voc-tree-help tree-btn" tabindex="0" role="button" style="margin-right: 20px;" data-target="#' + tmpmodalname + '" data-toggle="modal">?</a>';
								}
							} catch (err) {
								console.log("Exception: " + err);
							}
						}
						var tmpStr = '';
						if ('extraHtml' in value) {
							// not used yet
							tmpStr = value['extraHtml'] + tmpStr;
						}
						$entity.find('.tree-item-name').html(thisname + tmpStr);
						if ('vc' in value) {
							$entity.attr('id', value['vc']);
						}
						$entity.data(value);
					}
                    
					if ($el.hasClass('tree-folder-header')) {
						$el.parent().find('.tree-folder-content:eq(0)').append($entity);
					} else {
						$el.append($entity);
					}
                });
                
                self.$element.trigger('loaded');
            });
        },
        
        selectItem: function(el, shiftKeyPressed=false) {
            if (this.options['selectable'] == false)
                return;
            var $el = $(el);
            var $all = this.$element.find('.tree-selected');
            var data = [];
            /*
            var $all = this.$element.find('.tree-selected');
            if ($all[0] !== $el[0]) {
                $all.removeClass('tree-selected');
                $el.addClass('tree-selected');
                // voc
            }
            */
            if (shiftKeyPressed) {
                if ($el.hasClass('tree-selected')) {
                    $el.removeClass('tree-selected');
                    $el.find('i').removeClass(this.options['selected-icon']).addClass(this.options['unselected-icon']);
                } else {
                    $el.addClass('tree-selected');
                    $el.find('i').removeClass(this.options['unselected-icon']).addClass(this.options['selected-icon']);
                    data.push($el.data());
                }
            } else {
                data.push($el.data());
                $all.removeClass('tree-selected');
                $el.addClass('tree-selected');
            }

            if (this.options.multiSelect) {
                if (shiftKeyPressed) {
                    $.each($all, function(index, value) {
                        var $val = $(value);
                        if ($val[0] !== $el[0]) {
                            data.push($(value).data());
                        }
                    });
                }
            }
            else if ($all[0] !== $el[0]) {
            	$all.removeClass('tree-selected').find('icon-caret-right').removeClass(this.options['selected-icon']).addClass(this.options['unselected-icon']);
            }
            if (1||data.length) {
                this.$element.trigger('selected', {
                    info: data
                });
            }
        
        },
        
        selectFolder: function(el, shiftKeyPressed=false) {
            var $el = $(el);
            var $par = $el.parent();
            var $all = this.$element.find('.tree-selected');
            var data = [];

            if (shiftKeyPressed) {
                if ($el.hasClass('tree-selected')) {
                    $el.removeClass('tree-selected');
                } else {
                    $el.addClass('tree-selected');
                    data.push($el.data());
                }
            } else {
                data.push($el.data());
                $all.removeClass('tree-selected');
                $el.addClass('tree-selected');
            }

            if (this.options.multiSelect) {
                if (shiftKeyPressed) {
                    $.each($all, function(index, value) {
                        var $val = $(value);
                        if ($val[0] !== $el[0]) {
                            data.push($(value).data());
                        }
                    });
                }
            }
            else if ($all[0] !== $el[0]) {
            	$all.removeClass('tree-selected').find('icon-caret-right').removeClass(this.options['selected-icon']).addClass(this.options['unselected-icon']);
            }
            if (1||data.length) {
                this.$element.trigger('selectedfolder', {
                    info: data
                });
            }
        },
        
        openFolder: function(el) {
            var $el = $(el);
            var $par = $el.parent();
            //var $all = this.$element.find('.tree-selected');
            var data = [];
            /*
            if ($all[0] !== $el[0]) {
                $all.removeClass('tree-selected');
                $el.addClass('tree-selected');
                // voc
            }
            */
            data.push($el.data());

            if ($el.find('.' + this.options['close-icon']).length) {
                if ($par.find('.tree-folder-content').children().length) {
                    $par.find('.tree-folder-content:eq(0)').show();
                } else {
                    this.populate($el);
                }
                
                $par.find('.' + this.options['close-icon'] + ':eq(0)')
                .removeClass(this.options['close-icon'])
                .addClass(this.options['open-icon']);
                
                this.$element.trigger('opened', $el.data());
            
            } else {
                if (this.options.cacheItems) {
                    $par.find('.tree-folder-content:eq(0)').hide();
                } else {
                    $par.find('.tree-folder-content:eq(0)').empty();
                }
                
                $par.find('.' + this.options['open-icon'] + ':eq(0)')
                .removeClass(this.options['open-icon'])
                .addClass(this.options['close-icon']);
                
                this.$element.trigger('closed', $el.data());
            }
            if (0&&data.length) {
                this.$element.trigger('selectedfolder', {
                    info: data
                });
            }
        },
        
        selectedItems: function() {
            var $sel = this.$element.find('.tree-selected');
            var data = [];
            
            $.each($sel, function(index, value) {
                data.push($(value).data());
            });
            return data;
        },
    };
    
    
    // TREE PLUGIN DEFINITION
    
    $.fn.setTreeData = function(val) {
        var $this = $(this);
        $this.data('tree').options.dataSource = val;
        $this.data('tree').render();
    }
    ;
    
    $.fn.tree = function(option, value) {
        var methodReturn;
        
        var $set = this.each(function() {
            var $this = $(this);
            var data = $this.data('tree');
            var options = typeof option === 'object' && option;
            
            if (!data)
                $this.data('tree', (data = new Tree(this,options)));
            if (typeof option === 'string')
                methodReturn = data[option](value);
        });
        
        return (methodReturn === undefined) ? $set : methodReturn;
    }
    ;
    
    $.fn.tree.defaults = {
        multiSelect: false,
        loadingHTML: '<div>Loading...</div>',
        cacheItems: true
    };
    
    $.fn.tree.Constructor = Tree;

})(window.jQuery);
