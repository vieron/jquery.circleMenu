// 
//  jquery.circleMenu.js
//  A jQuery plugin for create animated carousels that loads dynamic content via ajax
//  
//  Created by Javier Sánchez - Marín (vieron) 
//  http://github.com/vieron/circleMenu
//  Free distribution.
// 

(function($) {

  $.fn.circleMenu = function(options) {

    // build main options before element iteration
    var opts = $.extend({}, $.fn.circleMenu.defaults, options);
    $.fn.circleMenu.options = opts;
  
    // iterate and reformat each matched element
    return this.each(function() {   
        // declaring vars
         var $wrap = $(this),
             $target,
             items = $(opts.item, $wrap),
             numChildren = items.length,
             iAngle = 360/numChildren,
             degrees = 0,
             callBackHandler = function(direction){
               setTimeout(function(){
                 opts.animationParams[direction].callBack();
               }, opts.animationParams[direction].speed);
             },
             animate = function(target, direction, y, x, opacity){
               target.stop().animate({'top': y , 'left': x, 'opacity' : opacity }, { 
                 duration : opts.animationParams[direction].speed,
                 specialEasing: {
                   'top'    : opts.animationParams[direction].animationType['top'],
                   'left'   : opts.animationParams[direction].animationType['left'],
                   'opacity': opts.animationParams[direction].animationType['opacity']
                 }
               });
             }
          items.css({'position' : 'absolute', 'top' : 0, 'z-index': 1, 'opacity' : opts.styles.collapsedOpacity });
          $wrap.css({'position': 'relative', 'width': opts.widht, 'height' : opts.height }).addClass('circleMenuWrap');
          $wrap.prepend('<'+opts.item+' class="'+opts.target_class+'"><a style="widht:'+opts.widht+'; height:'+opts.height+';" href="#">open</a></'+opts.item+'>');
          $target = $('.'+opts.target_class, $wrap);
          
          items
            .bind('mouseover', function(e){
              $(this)
                .addClass('over');
            })
            .bind('mouseleave', function(e){
              $(this)
                .removeClass('over');
            })
            .each(function(i, e){
              var item = $(this),
                  radians = (degrees * Math.PI / 180),
                  new_x = Math.round(0 + Math.sin(radians) * opts.displacement),
                  new_y = Math.round(0 + Math.cos(radians) * opts.displacement);
              
              if (radians > 0 && radians < Math.PI/2){
                item.addClass('CMItem_bottomright');
              }else if (radians > Math.PI/2 && radians < Math.PI){
                item.addClass('CMItem_topright');
              }else if (radians > Math.PI && radians < (3*Math.PI)/2){
                item.addClass('CMItem_topleft');
              }else if (radians > (3*Math.PI)/2 && radians <2*Math.PI){
                item.addClass('CMItem_bottomleft');
              }else if (radians == 0 || radians == 2*Math.PI){
                item.addClass('CMItem_bottom');
              }else if (radians == Math.PI/2){
                item.addClass('CMItem_right');
              }else if (radians == Math.PI){
                item.addClass('CMItem_top');
              }else if (radians == (3*Math.PI)/2){
                item.addClass('CMItem_left');
              }
              
/*              alert('x: '+new_x+' y: '+new_y);*/
              
              $(this)
              .bind('expand', function(){
                animate($(this), 'out', new_y, new_x, opts.styles.expandedOpacity);
              })
              .bind('collapse', function(){
                animate($(this), 'in', 0, 0, opts.styles.collapsedOpacity);
              })
              
              degrees += iAngle;
            });
          
          
          
            $wrap
            .bind('expandAll', function(){
                items.trigger('expand');
                $wrap.addClass('active');
                opts.onExpand($wrap, items)
            })
            .bind('collapseAll', function(){
                items.trigger('collapse');
                $wrap.removeClass('active');
                opts.onCollapse($wrap, items)
            });
          
          
          $target
            .css({'z-index': '100', 'position': 'relative', 'float':'left' })
            .bind('click', function(e){
                e.preventDefault();
                
              //collapse menu
              if($wrap.hasClass('active')){
                $wrap.trigger('collapseAll');
                callBackHandler('in');
              
              //expand menu  
              }else{
                //hide other opened menus if opts.solo == true
                if  (opts.solo === true) {
                  var menus_expanded = $('.circleMenuWrap.active');
                  if (menus_expanded.length > 0 ) {
                    menus_expanded.trigger('collapseAll');
                  }
                }
                
                $wrap.trigger('expandAll');
                callBackHandler('out');
              }

            });
           

    });
  }; 


  // plugin defaults
  $.fn.circleMenu.defaults = {
    target_class : 'cM_target',
    item : 'li',
    widht : '20px',
    height : '20px',
    displacement : 32,
    solo : true,
    styles : {
      expandedOpacity : 1,
      collapsedOpacity : 0
    },
    animationParams : {
      'in'  : {
        speed     : 450,
        animationType : {
          'top'    : 'swing',
          'left'   : 'swing',
          'opacity': 'linear'
        },
        callBack  : function(){}
      },
      'out' : {
        speed     : 450,
        animationType : {
          'top'    : 'swing',
          'left'   : 'swing',
          'opacity': 'linear'
        },
        callBack  : function(){}
      }
    },
    onExpand : function(wrap, items){
      
    },
    onCollapse : function(wrap, items){
     
    }
  };


})(jQuery);

