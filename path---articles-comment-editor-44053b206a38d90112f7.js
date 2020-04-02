webpackJsonp([0xc25392468d28],{300:function(t,n){t.exports={data:{markdownRemark:{html:'<h2>基本介绍</h2>\n<p>现在市面上有非常多的基于 Vue 的组件库，但是看了好多都没有发现有关留言评论的组件，这对于想做一些文章信息展示类的项目可就显得棘手了，因为有太多的页面需要这个功能了，难道我们需要重复的去写（复制粘贴）这些代码吗？对于现在模块化体系逐渐完善的前端工程项目来说，一次性封装一个通用功能的组件式非常有必要的，那现在我们就去封装这样一个组件吧！</p>\n<h2>必备技术（Vue）</h2>\n<p>由于封装的组件式基于 Vue 的，所以这就要求我们需要掌握 Vue 的一些知识才行（Vue 小白建议先去官方文档阅读相关知识:grinning:），而对于有 Vue 基本功的同学可以通过封装这样一个功能完善的组件来加深对 Vue 组件化编程的理解。现在就让我们来实现这个组件的封装吧</p>\n<h2>必不可少的文本输入框</h2>\n<p>我们知道原生的 HTML 元素只有表单元素可以输入文本，但是这些元素默认情况下在不同的浏览器中渲染的样式各不相同，而且不支持输入有格式的文本，所以我们有必要用 Div 元素模拟一个具有格式化文本功能的输入框。</p>\n<p>怎么才能使 Div 也能输入文字呢，这里就要说到一个 HTML5 的新属性"contenteditable"了。这个属性值是个布尔类型，给标签元素添加上这个属性且设置其属性值为 true 的话（默认不设置浏览器解析为 true），现在这个元素就是一个可编辑其内容的元素，用户就可以像使用表单元素一样来使用它了，现在让我们用代码来演示一下</p>\n<div class="gatsby-highlight">\n      <pre class="language-html"><code class="language-html">&lt;!-- 这里只演示主要代码 --&gt;\n\n&lt;style&gt;\n.inputBox{\n  border:1px solid;\n  height:200px;\n  width:400px;\n}\n&lt;/style&gt;\n\n\n&lt;div class=&quot;inputBox&quot; contenteditable=&quot;true&quot;&gt;我是可以被编辑的元素&lt;/div&gt;</code></pre>\n      </div>\n<p>页面实际的效果是这样的\n<img src="https://github.com/konglingwen94/comment-message-editor/blob/master/screenshots/1.gif?raw=true" alt="封装一个留言评论编辑器组件"></p>\n<p>至此一个可以输入文字的输入框我们就实现了，然后你还可以给它加上一些其他的样式使它更完善，这里就不在演示了。</p>\n<h2>封装输入框组件</h2>\n<p>为了更好的代码逻辑抽离以及后期的组件可维护性，我们把编辑器输入框的部分单独抽离为一个组件进行封装使用。有了前面的知识铺垫，封装这样一个组件也就很容易上手了，具体是怎么实现的我们直接看代码吧！</p>\n<div class="gatsby-highlight">\n      <pre class="language-html"><code class="language-html">&lt;!-- input-box.vue --&gt;\n&lt;template&gt;\n  &lt;div class&gt;\n    &lt;div type=&quot;text&quot; class=&quot;input-box-wrapper&quot;&gt;\n      &lt;div\n        :class=&quot;[&#39;content&#39;,{focused},type]&quot;\n        ref=&quot;richText&quot;\n        v-on=&quot;listeners&quot;\n        v-bind=&quot;$attrs&quot;\n        :contenteditable=&quot;contenteditable&quot;\n      &gt;&lt;/div&gt;\n      &lt;div class=&quot;append-wrapper&quot;&gt;\n        &lt;slot name=&quot;append&quot;&gt;&lt;/slot&gt;\n      &lt;/div&gt;\n    &lt;/div&gt;\n  &lt;/div&gt;\n&lt;/template&gt;\n&lt;script&gt;\nexport default {\n  name: &#39;input-box&#39;,\n  data() {\n    return {\n      contenteditable: true\n    }\n  },\n  computed: {\n    listeners() {\n      return Object.assign(\n        {},\n        this.$listeners,\n        {\n          input: function(e) {\n            const inputContent =\n              this.contentType === &#39;plain&#39;\n                ? e.target.textContent\n                : e.target.innerHTML\n            this.$emit(&#39;input&#39;, inputContent)\n          }.bind(this)\n        }\n      )\n    }\n  },\n  props: {\n    focused: {\n      type: Boolean,\n      default: false\n    },\n    contentType: {\n      type: String,\n      default: &#39;plain&#39;,\n      validator(value) {\n        return [&#39;plain&#39;, &#39;rich&#39;].includes(value)\n      }\n    },\n    type: {\n      type: String,\n      default: &#39;text&#39;,\n      validator(value) {\n        return [&#39;text&#39;, &#39;textarea&#39;].includes(value)\n      }\n    },\n    rows: Number\n  },\n  methods: {\n    focus() {\n      this.$refs.richText.focus()\n    }\n  }\n}\n&lt;/script&gt;\n\n&lt;style scoped lang=&quot;less&quot;&gt;\n.input-box-wrapper {\n  position: relative;\n\n}\n.content {\n  max-height: 5em;\n  overflow: auto;\n  &amp;::-webkit-scrollbar {\n    width: 0;\n  }\n  &amp;.textarea {\n    min-height: 2.7em;\n  }\n  &amp;.text {\n    min-height: 1.2em;\n  }\n  &amp;:empty:before {\n    content: attr(placeholder);\n    color: #ccc;\n    position: absolute;\n    left: 10px;\n    top: 7px;\n  }\n  &amp;.focused {\n    border: #66b1ff 1px solid;\n    cursor: text;\n  }\n  &amp;:focus {\n    outline: none;\n  }\n  border: 1px solid #ccc;\n  border-radius: 3px;\n  padding: 7px 10px;\n  padding-right: 30px;\n  position: relative;\n}\n.append-wrapper {\n  position: absolute;\n  right: 1px;\n  top: 1px;\n  bottom: 1px;\n  display: flex;\n  cursor: pointer;\n  align-items: center;\n}\n&lt;/style&gt;</code></pre>\n      </div>\n<p>实际的组件效果是这样的 <br></p>\n<p><img src="https://github.com/konglingwen94/comment-message-editor/blob/master/screenshots/2.gif?raw=true" alt="封装一个留言评论编辑器组件"></p>\n<p>至此一个用 Div 元素模拟后的文本输入框组件我们就做好了。</p>\n<blockquote>\n<p>备注：完整的 input-box 组件代码来自开源项目<a href="https://github.com/konglingwen94/comment-message-editor/blob/master/src/components/input-box.vue">comment-message-editor</a></p>\n</blockquote>\n<h2>丰富的表情符号选择器组件（:smile:）</h2>\n<p>当我们在给一篇文章或者一个评论留言的时候混合使用文字和表情符号能使我们的语言更简练，同时也更有表达力。那为什么要封装符号选择器组件呢？答案是：在日益复杂的前端工程化环境中，所有将来可被复用或者需要扩展维护的功能模块面前，我们都需要把它抽离出来，这样以后不论是更改某一处的代码还是增加新的功能我们都能够很好的去维护并提交。这里顺便也把组件的源代码贴出来共大家平时做同类型的功能时可以参考。</p>\n<blockquote>\n<p>代码来自开源项目<a href="https://github.com/konglingwen94/comment-message-editor/blob/master/src/components/emoji-picker.vue">comment-editor</a></p>\n</blockquote>\n<div class="gatsby-highlight">\n      <pre class="language-html"><code class="language-html">&lt;!-- emoji-picker.vue --&gt;\n\n&lt;template&gt;\n  &lt;div\n    @keyup.esc=&quot;hidePicker&quot;\n    ref=&quot;container&quot;\n    class=&quot;emoji-wrapper&quot;\n    hidefocus=&quot;true&quot;\n    v-on=&quot;handleMouse()&quot;\n  &gt;\n    &lt;span class=&quot;emoji-button&quot; @click.stop=&quot;togglePickerVisibility&quot;&gt;\n      &lt;img\n        :class=&quot;{inactive:!pickerVisible}&quot;\n        class=&quot;button-icon&quot;\n        src=&quot;../emoji/icon.svg&quot;\n        width=&quot;20&quot;\n        height=&quot;20&quot;\n        alt\n      /&gt;\n      &lt;span v-if=&quot;buttonTextVisible&quot; class=&quot;button-text&quot;&gt;表情&lt;/span&gt;\n    &lt;/span&gt;\n    &lt;ul :class=&quot;[&#39;emoji-picker&#39;,pickerPosition]&quot; v-if=&quot;pickerVisible&quot;&gt;\n      &lt;li v-for=&quot;(url,key) in files&quot; :key=&quot;key&quot; class=&quot;emoji-picker-item&quot;&gt;\n        &lt;img class=&quot;emoji-icon&quot; @click=&quot;handlerSelect&quot; width=&quot;20&quot; height=&quot;20&quot; :src=&quot;url&quot; alt /&gt;\n      &lt;/li&gt;\n    &lt;/ul&gt;\n  &lt;/div&gt;\n&lt;/template&gt;\n&lt;script type=&quot;text/javascript&quot;&gt;\nconst path = require(&#39;path&#39;)\nconst requireEmoji = require.context(&#39;../emoji&#39;)\nlet files = requireEmoji.keys()\nexport default {\n  data() {\n    return {\n      pickerVisible: false,\n      files: files.map(url =&gt; require(`../emoji/${url.slice(2)}`))\n    }\n  },\n  props: {\n    buttonTextVisible: {\n      type: Boolean,\n      default: true\n    },\n    triggerPick: {\n      tyep: String,\n      default: &#39;hover&#39;,\n      validator(value) {\n        return [&#39;hover&#39;, &#39;click&#39;].includes(value)\n      }\n    },\n    pickerPosition: {\n      type: String,\n      default: &#39;right&#39;,\n      validator(value) {\n        return [&#39;left&#39;, &#39;middle&#39;, &#39;right&#39;].includes(value)\n      }\n    }\n  },\n  watch: {\n    pickerVisible(newValue) {\n      newValue ? this.$emit(&#39;activated&#39;) : this.$emit(&#39;inactivated&#39;)\n    }\n  },\n  mounted() {\n    const docHandleClick = (this.docHandleClick = e =&gt; {\n      if (!this.$refs.container.contains(e.target)) {\n        this.hidePicker()\n      }\n    })\n    const handleKeyup = (this.handleKeyup = e =&gt; {\n      if (e.key === &#39;Escape&#39;) {\n        this.hidePicker()\n      }\n    })\n    document.addEventListener(&#39;click&#39;, docHandleClick)\n    document.addEventListener(&#39;keyup&#39;, handleKeyup)\n  },\n  destroyed() {\n    document.removeEventListener(&#39;click&#39;, this.docHandleClick)\n    document.removeEventListener(&#39;click&#39;, this.handleKeyup)\n  },\n  methods: {\n    handlerSelect(e) {\n      this.$emit(&#39;selected&#39;, e)\n    },\n    hidePicker() {\n      this.pickerVisible = false\n    },\n    togglePickerVisibility() {\n      if (this.triggerPick === &#39;click&#39;) {\n        this.pickerVisible = !this.pickerVisible\n      }\n    },\n    handleMouse() {\n      const mouseenter = function() {\n        this.pickerVisible = true\n      }.bind(this)\n      const mouseleave = function() {\n        this.pickerVisible = false\n      }.bind(this)\n      if (this.triggerPick === &#39;hover&#39;) {\n        return {\n          mouseenter,\n          mouseleave\n        }\n      } else {\n        return {}\n      }\n    }\n  }\n}\n&lt;/script&gt;\n&lt;style scoped &gt;\nul,\nli {\n  list-style: none;\n  margin: 0;\n}\n&lt;/style&gt;\n\n&lt;style scoped lang=&quot;less&quot;&gt;\n.emoji-picker {\n  display: flex;\n  flex-wrap: wrap;\n  width: 300px;\n}\n.emoji-picker-item {\n  margin: 4px;\n  cursor: pointer;\n  img {\n    user-select: none;\n  }\n}\n.emoji-wrapper {\n  position: relative;\n  display: inline-block;\n  z-index: 10000;\n}\n.emoji-button {\n  font-size: 14px;\n  cursor: pointer;\n  user-select: none;\n  .button-icon {\n    &amp;.inactive {\n      filter: grayscale(100%);\n    }\n  }\n  &amp;:hover {\n    color: #027fff;\n  }\n  .button-text {\n    vertical-align: super;\n  }\n}\n.emoji-picker {\n  background: #fff;\n  box-shadow: #ccc 1px 1px 7px;\n  border-radius: 5px;\n  padding: 10px;\n  display: flex;\n  position: absolute;\n  &amp;.left {\n    right: 0;\n  }\n  &amp;.middle {\n    left: 50%;\n    transform: translateX(-50%);\n  }\n}\n&lt;/style&gt;</code></pre>\n      </div>\n<h2>组装编辑器入口组件</h2>\n<p>我们有了输入框组件和表情符号选择器组件，接下来只要把他们按一定的使用方式组合起来，我们的评论编辑器组件就大功告成了。废话不多说让我们看代码吧</p>\n<blockquote>\n<p>源代码来自开源项目<a href="https://github.com/konglingwen94/comment-message-editor/blob/master/src/main.vue">comment-message-editor</a></p>\n</blockquote>\n<div class="gatsby-highlight">\n      <pre class="language-html"><code class="language-html">&lt;!-- main.vue --&gt;\n\n&lt;template&gt;\n  &lt;div class=&quot;comment-editor&quot; ref=&quot;container&quot;&gt;\n    &lt;div class=&quot;input-wrapper&quot; :class=&quot;{inline}&quot;&gt;\n      &lt;input-box\n        ref=&quot;inputBox&quot;\n        :type=&quot;inline?&#39;text&#39;:&#39;textarea&#39;&quot;\n        content-type=&quot;rich&quot;\n        :rows=&quot;2&quot;\n        @focus=&quot;onInputFocus&quot;\n        @blur=&quot;onInputBlur&quot;\n        @keyup.enter.ctrl.exact.native=&quot;handlerSubmit&quot;\n        v-model=&quot;inputContent&quot;\n        :placeholder=&quot;&#39;placeholder&#39;&quot;\n        :focused=&quot;showInlineButton&quot;\n        class=&quot;input-box&quot;\n      &gt;\n        &lt;div v-if=&quot;inline&quot; :class=&quot;[&#39;input-append&#39;,{hasbg:!showInlineButton}]&quot; slot=&quot;append&quot;&gt;\n          &lt;emoji-picker\n            ref=&quot;emojiPicker&quot;\n            trigger-pick=&quot;click&quot;\n            @activated=&quot;inputBoxFocused=true&quot;\n            @selected=&quot;handlerEmojiSelected&quot;\n            picker-position=&quot;left&quot;\n            :button-text-visible=&quot;false&quot;\n          &gt;&lt;/emoji-picker&gt;\n        &lt;/div&gt;\n      &lt;/input-box&gt;\n      &lt;transition name=&quot;button&quot; &gt;\n        &lt;div\n          @click=&quot;handlerSubmit&quot;\n          class=&quot;submit-button inline&quot;\n          :disabled=&quot;!inputContent&quot;\n          ref=&quot;button&quot;\n          v-show=&quot;showInlineButton &amp;&amp; inline&quot;\n        &gt;{{buttonText}}&lt;/div&gt;\n      &lt;/transition&gt;\n    &lt;/div&gt;\n    &lt;div class=&quot;footer-action&quot; v-if=&quot;!inline&quot;&gt;\n      &lt;emoji-picker\n        trigger-pick=&quot;click&quot;\n        @activated=&quot;$refs.inputBox.focus()&quot;\n        @selected=&quot;handlerEmojiSelected&quot;\n      &gt;&lt;/emoji-picker&gt;\n      &lt;span class=&quot;submit-tiptext&quot;&gt;Ctrl + Enter&lt;/span&gt;\n      &lt;div @click=&quot;handlerSubmit&quot; class=&quot;submit-button&quot; :disabled=&quot;!inputContent&quot;&gt;{{buttonText}}&lt;/div&gt;\n    &lt;/div&gt;\n  &lt;/div&gt;\n&lt;/template&gt;\n&lt;script&gt;\nimport InputBox from &#39;./components/input-box&#39;\nimport EmojiPicker from &#39;./components/emoji-picker&#39;\nexport default {\n  name: &#39;comment-editor&#39;,\n  components: { InputBox, EmojiPicker },\n  data() {\n    return {\n      active: false,\n      inputContent: &#39;&#39;,\n      inputBoxFocused: false\n    }\n  },\n  props: {\n    buttonText: {\n      type: String,\n      default: &#39;提交&#39;\n    },\n    inline: {\n      type: Boolean,\n      default: false\n    }\n  },\n  computed: {\n    showInlineButton() {\n      return !!(this.inputBoxFocused || this.inputContent)\n    }\n  },\n  destroyed() {\n    document.removeEventListener(&#39;click&#39;, this.hideButton)\n  },\n  mounted() {\n    document.addEventListener(&#39;click&#39;, this.hideButton)\n  },\n  methods: {\n    focus(){\n      this.$refs.inputBox.focus()\n    },\n    hideButton(e) {\n      if (this.$refs.container.contains(e.target)) {\n        return\n      }\n      if (!this.$refs.container.contains(e.target)) {\n        this.inputBoxFocused = false\n      }\n    },\n    onInputFocus(e) {\n      this.inputBoxFocused = true\n    },\n    onInputBlur(e) {\n      if (this.$refs.container.contains(e.target)) {\n        return\n      }\n      this.inputBoxFocused = false\n    },\n    handlerSubmit(e) {\n      if (e.target.hasAttribute(&#39;disabled&#39;)) {\n        return\n      }\n      this.$emit(&#39;submit&#39;, this.inputContent)\n    },\n    handlerEmojiSelected(e) {\n      this.$refs.inputBox.focus()\n      const clonedNode = e.target.cloneNode(true)\n      clonedNode.style.verticalAlign = &#39;text-top&#39;\n      document.execCommand(&#39;insertHTML&#39;, false, clonedNode.outerHTML)\n    }\n  }\n}\n&lt;/script&gt;\n\n&lt;style scoped lang=&quot;less&quot;&gt;\n.input-wrapper {\n  &amp;.inline {\n    display: flex;\n    .input-box {\n      flex: 1;\n      margin-right: 14px;\n    }\n  }\n  .input-append {\n    width: 30px;\n    height: 100%;\n    display: flex;\n    align-items: flex-end;\n    justify-content: center;\n    &amp;.hasbg {\n      background: #eee;\n    }\n  }\n}\n.footer-action {\n  margin-top: 10px;\n  display: flex;\n  align-items: center;\n}\n.submit-tiptext {\n  margin-left: auto;\n  margin-right: 4px;\n  font-size: 14px;\n  color: #ccc;\n}\n.submit-button {\n  align-self:flex-end;\n  transition:all 0.2s;\n  background: #409eff;\n  border-radius: 4px;\n  display: inline-block;\n  cursor: pointer;\n  padding: 6px 10px;\n  color: white;\n  user-select: none;\n&amp;.button-enter,&amp;.button-leave-to{\n  // zoom:0;\n  margin-left:-40px;\n  transform:scale(0,0)\n}\n  &amp;[disabled] {\n    cursor: not-allowed;\n    background: #66b1ff;\n  }\n  &amp;:hover {\n    background: #66b1ff;\n  }\n  &amp;:not([disabled]):active {\n    background: #3a8ee6;\n  }\n}\n&lt;/style&gt;</code></pre>\n      </div>\n<h2>组件效果预览</h2>\n<p><img src="https://github.com/konglingwen94/comment-message-editor/blob/master/screenshots/1.gif?raw=true" alt="封装一个留言评论编辑器组件">\n<img src="https://github.com/konglingwen94/comment-message-editor/blob/master/screenshots/2.gif?raw=true" alt="封装一个留言评论编辑器组件"></p>\n<p>文章最后附上本项目的<a href="https://github.com/konglingwen94/comment-message-editor">仓库地址</a></p>\n<p>备注：本文属于作者原创，转载请注明出处，谢谢！<br>\n作者：孔令文</p>',frontmatter:{title:"封装一个基于Vue的留言评论编辑器组件",date:"2020-03-26",category:"Vue",tags:["轮子"],cover:""}},site:{siteMetadata:{url:"https://konglingwen94.github.io",thumbnail:"",defaultAuthor:"孔令文",donation:{status:!0,channel:{alipay:"https://cdn-images-1.medium.com/max/1600/1*PZjwR1Nbluff5IMI6Y1T6g@2x.png",wechat:""}},share:!0}}},pathContext:{slug:"/comment-editor/",title:"封装一个基于Vue的留言评论编辑器组件",excerpt:"基本介绍 现在市面上有非常多的基于 Vue…",prev:{fields:{slug:"/good-swiper/"},frontmatter:{title:"封装一个自己的轮播图组件（基于 Vue）",category:"轮子",tags:["Vue"],cover:"",date:"2020-04-02"},excerpt:"…"},next:{fields:{slug:"/element-resize-event-polyfill/"},frontmatter:{title:"如何手动实现DOM元素的Resize事件侦听器",category:"轮子",tags:["默认"],cover:"",date:"2020-03-22"},excerpt:"如何手动实现 DOM 元素的 Resize 事件侦听器 基本介绍 我们都知道浏览器是没有原生的 DOMResize 事件的，唯一能监测到 Resize 事件的对象就是 window 这个全局对象，但是这个事件只有在窗口大小改变的时候才会触发。当我们需要在 DOM…"}}}}});
//# sourceMappingURL=path---articles-comment-editor-44053b206a38d90112f7.js.map