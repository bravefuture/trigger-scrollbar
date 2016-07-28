# trigger-scrollbar
## 模拟滚动条
html结构：
```html
<a href="javascript:void(0)" id="hAdd">添加内容+</a>
<div class="wrap">
	<div id="v" class="content" data-trigger="scrollbar" data-options="{'direction':'vertical','barBg' :'#barBg','bar':'#bar','barContainer':'#barContainer'}" autocomplete="off">
		<div class="bar-bg" id="barBg"></div>
		<div class="bar" id="bar"></div>
		<div class="bar-content" id="barContainer">			
		</div>
	</div>
</div>
```

方法：
```javascript
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
```