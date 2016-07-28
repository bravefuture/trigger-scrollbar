/**
 * [h5播放器]
 * @update: 2016.07.28
 * @author: yongcheng0660@163.com
 * @github: https://github.com/bravefuture
 * html结构：
<a href="javascript:void(0)" id="hAdd">添加内容+</a>
<div class="wrap">
	<div id="v" class="content" data-trigger="scrollbar" data-options="{'direction':'vertical','barBg' :'#barBg','bar':'#bar','barContainer':'#barContainer'}" autocomplete="off">
		<div class="bar-bg" id="barBg"></div>
		<div class="bar" id="bar"></div>
		<div class="bar-content" id="barContainer">			
		</div>
	</div>
</div>
 * 	
 * 方法
var v = $('#v').data('enjoy.scrollbar');
var i = 1;
$('#vAdd').on('click', function(){
	$('#barContainer').append('<div style="height:100px;">content' + (i++) + '</div>');
	// 从新设置滚动条
	v.reset();
	// 滚动到底部
	v.scrollDown();
});
// 监听滚动数据
$('#v').on('scrolling.enjoy.scrollbar', function(e, sT, top){
	console.log && console.log(sT);
});
 */
(function($, undefined) {
    /**
     * [dataTrigger data属性API]
     * @type {String}
     */
    var dataTrigger = '[data-trigger="scrollbar"]';
    /**
     * [禁止拖拉滚动条选中文字]
     * @return {[type]} [description]
     */
    var selection = (function() {
        if (window.getSelection) {
            return function() {
                window.getSelection().removeAllRanges();
            }
        } else {
            return function() {
                document.selection.empty();
            }
        }
    })();
    /**
     * [Scrollbar 模拟滚动条构造函数]
     */
    var Scrollbar = function(element, options) {
        /**
         * [获取该元素对象]
         */
        this.scrollbarDom = element;
        /**
         * [获取参数值]
         */
        this.direction = options.direction;
        this.barSelector = options.bar;
        this.bar = $(options.bar);
        this.barBgSelector = options.barBg;
        this.barBg = $(options.barBg);
        this.barContainer = $(options.barContainer);
        this.widthH = options.widthH;
        /**
         * [是初始化垂直滚动条还是水平滚动条]
         * @param  {[type]} that [description]
         * @return {[type]}      [description]
         */
        this.vh = (function(that) {
            if (that.direction === 'vertical') {
                return that.vertical;
            } else if (that.direction === 'horizontal') {
                return that.horizontal;
            }
        })(this);
        this.vh();
    };
    /**
     * [version 定义版本号]
     * @type {String}
     */
    Scrollbar.prototype.version = '2.0.0';
    /**
     * [oneBarDrag 只绑定一次拖拉滚动条事件]
     * @type {Boolean}
     */
    Scrollbar.prototype.oneBarDrag = true;
    /**
     * [barShowHide 显示或隐藏滚动条]
     * @this  {[type]} sH [description]
     * @return {[type]}    [description]
     */
    Scrollbar.prototype.barShowHide = function(sH) {
        if (sH) {
            this.bar.show();
            this.barBg.show();
        } else {
            this.bar.hide();
            this.barBg.hide();
        }
    };
    /**
     * [reset 当内容发生变化时，从新设置滚动条]
     * @return {[type]} [description]
     */
    Scrollbar.prototype.reset = function(w) {
        this.vh(w);
    };
    /**
     * [scrollDown 滚动到底部]
     * @return {[type]} [description]
     */
    Scrollbar.prototype.scrollDown = function() {
        this.scrollbarDom.scrollTop(this.barContainerH);
    };
    /**
     * [scrollRight 滚动到右边]
     * @return {[type]} [description]
     */
    Scrollbar.prototype.scrollRight = function() {
        this.scrollbarDom.scrollLeft(this.barContainerW);
    };
    /**
     * [vertical 垂直滚动条]
     * @return {[type]} [description]
     */
    Scrollbar.prototype.vertical = function() {
        var that = this;
        this.scrollbarDomH = this.scrollbarDom.height();
        this.barContainerH = this.barContainer.outerHeight();
        var isSH = this.barContainerH > this.scrollbarDomH;
        this.barShowHide(isSH);
        if (isSH <= 0) {
            return;
        }
        this.scale = this.barContainerH / this.scrollbarDomH;
        this.barH = this.scrollbarDomH / this.scale;
        this.bar.height(this.barH);
        /**
         * [绑定滚动事件]
         */
        this.scrollbarDom.off('scroll.enjoy.scrollbar').on('scroll.enjoy.scrollbar', function() {
            var sT = $(this).scrollTop();
            var top = sT / that.scale;
            that.bar.css({
                top: top
            });
            /**
             * [监听滚动数据]
             */
            $(this).trigger('scrolling.enjoy.scrollbar', [sT, top]);
        }).scroll();

        if (this.oneBarDrag === true) {
            this.barDragV();
            this.oneBarDrag = false;
        }
    };
    /**
     * [barDragV 拖拉垂直滚动条]
     * @return {[type]} [description]
     */
    Scrollbar.prototype.barDragV = function() {
            var that = this;
            var doc = $(document);
            doc.on('click.enjoy.scrollbar', this.barBgSelector, function(e) {
                var currentPageY = e.pageY;
                var scrollbarDomOT = that.scrollbarDom.offset().top;
                var pos = currentPageY - scrollbarDomOT;
                that.scrollbarDom.animate({ scrollTop: (pos - that.barH) * that.scale });
            });
            doc.on('mousedown.enjoy.scrollbar', this.barSelector, function(e) {
                var currentPageY = e.pageY;
                var barTop = parseInt(that.bar.css('top'));
                var move = 0;
                doc.on('mousemove.enjoy.scrollbar', function(e) {
                    selection();
                    move = e.pageY - currentPageY + barTop;
                    that.scrollbarDom.scrollTop(move * that.scale);
                });
                doc.on('mouseup.enjoy.scrollbar', function() {
                    doc.off('mouseup.enjoy.scrollbar');
                    doc.off('mousemove.enjoy.scrollbar');
                });
            });
        }
        /**
         * [horizontal 水平滚动条]
         * @return {[type]} [description]
         */
    Scrollbar.prototype.horizontal = function(w) {
        var that = this;
        this.scrollbarDomW = this.scrollbarDom.width();
        this.barContainerW = w || this.widthH;
        this.barContainer.outerWidth(this.barContainerW);
        var isSH = this.barContainerW > this.scrollbarDomW;
        this.barShowHide(isSH);
        if (isSH <= 0) {
            return;
        }
        this.scale = this.barContainerW / this.scrollbarDomW;
        this.barW = this.scrollbarDomW / this.scale;
        this.bar.width(this.barW);
        /**
         * [绑定滚动事件]
         */
        this.scrollbarDom.off('scroll.enjoy.scrollbar').on('scroll.enjoy.scrollbar', function() {
            var sT = $(this).scrollLeft();
            var left = sT / that.scale;
            that.bar.css({
                left: left
            });
            /**
             * [监听滚动数据]
             */
            $(this).trigger('scrolling.enjoy.scrollbar', [sT, left]);
        }).scroll();

        if (this.oneBarDrag === true) {
            this.barDragH();
            this.oneBarDrag = false;
        }
    };
    /**
     * [barDragV 拖拉水平滚动条]
     * @return {[type]} [description]
     */
    Scrollbar.prototype.barDragH = function() {
            var that = this;
            var doc = $(document);
            doc.on('click.enjoy.scrollbar', this.barBgSelector, function(e) {
                var currentPageX = e.pageX;
                var scrollbarDomOL = that.scrollbarDom.offset().left;
                var pos = currentPageX - scrollbarDomOL;
                that.scrollbarDom.animate({ scrollLeft: (pos - that.barW) * that.scale });
            });
            doc.on('mousedown.enjoy.scrollbar', this.barSelector, function(e) {
                var currentPageX = e.pageX;
                var barLeft = parseInt(that.bar.css('left'));
                var move = 0;
                doc.on('mousemove.enjoy.scrollbar', function(e) {
                    selection();
                    move = e.pageX - currentPageX + barLeft;
                    that.scrollbarDom.scrollLeft(move * that.scale);
                });
                doc.on('mouseup.enjoy.scrollbar', function() {
                    doc.off('mouseup.enjoy.scrollbar');
                    doc.off('mousemove.enjoy.scrollbar');
                });
            });
        }
        /**
         * [init 实例化]
         * @this  {[type]} options [description]
         * @return {[type]}         [description]
         */
    var init = function(options) {
        return this.each(function() {
            var _this = $(this);
            var data = _this.data('enjoy.scrollbar');
            if (!data) {
                _this.data('enjoy.scrollbar', (data = new Scrollbar(_this, options)))
            }
        });
    };
    /**
     * [参数设置]
     * @return {[type]} [description]
     */
    $(dataTrigger).each(function() {
        var _this = $(this);
        var dataOptions = _this.attr('data-options') || '';
        var pJData = dataOptions === '' ? {} : $.parseJSON(dataOptions.replace(/\'/g, '\"'));
        var options = $.extend({
            direction: 'vertical',
            barBg: null,
            bar: null,
            barContainer: null,
            widthH: 1000
        }, pJData || {});
        init.call(_this, options);
    });

})(jQuery, undefined);
