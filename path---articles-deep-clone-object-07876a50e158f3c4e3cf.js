webpackJsonp([0xfdd93988b8b],{305:function(n,s){n.exports={data:{markdownRemark:{html:'<p>文章首发于<a href="https://konglingwen94.github.io">个人博客</a></p>\n<h2>前提</h2>\n<p>在处理日常的业务开发当中，数据拷贝是经常需要用到的。但是 javascript 提供的数据操作 Api 当中能实现对象克隆的都是浅拷贝，比如 Object.assign 和 ES6 新增的对象扩展运算符（...）,这两个 Api 只能实现对象属性的一层拷贝，对于复制的属性其值如果是引用类型的情况下，拷贝过后的新对象还是会保留对它们的引用。</p>\n<h2>简单粗暴的深拷贝</h2>\n<p>ESMAScript 给我们提供了关于操作 JSON 数据的两个 APi，通过把 javascript 对象先转换为 JSON 数据，之后再把 JSON 数据转换为 Javascript 对象，这样就简单粗暴的实现了一个 javascript 对象的深拷贝，不论这个对象层级有多深，都会完全与源对象没有任何联系，切断其属性的引用，现在看一下这两个 API 用代码是怎么实现的。</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 现创建一个具有深度嵌套的源对象</span>\n<span class="token keyword">const</span> sourceObj <span class="token operator">=</span> <span class="token punctuation">{</span>\n  nested<span class="token operator">:</span> <span class="token punctuation">{</span>\n    name<span class="token operator">:</span> <span class="token string">\'KongLingWen\'</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 把源对象转化为JSON格式的字符串</span>\n\n<span class="token keyword">const</span> jsonTarget <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>sourceObj<span class="token punctuation">)</span>\n\n<span class="token comment">// 以解析json数据的方式转换为javascript对象</span>\n<span class="token keyword">let</span> target\n<span class="token keyword">try</span> <span class="token punctuation">{</span>\n  target <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>jsonTarget<span class="token punctuation">)</span> <span class="token comment">//数据如果不符合JSON对象格式会抛错，这里加一个错误处理</span>\n<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\ntarget<span class="token punctuation">.</span>nested<span class="token punctuation">.</span>name <span class="token operator">=</span> <span class="token string">\'\'</span>\n\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>soruceObj<span class="token punctuation">.</span>nested<span class="token punctuation">.</span>name<span class="token punctuation">)</span> <span class="token comment">//KongLingWen</span></code></pre>\n      </div>\n<p>代码最后通过更改新拷贝对象的 name 属性 ，输出源对象此属性的值不变，这说明我们以这种方式就实现了一个对象深拷贝。</p>\n<h2>JSON.parse 和 JSON.stringify 转换属性值前后的不一致性</h2>\n<ul>\n<li>函数无法序列化函数，属性值为函数的属性转换之后丢失</li>\n<li>日期 Date 对象\njavascript Date 对象转换到 JSON 对象之后无法反解析为 原对象类型，解析后的值仍然是 JSON 格式的字符串</li>\n<li>正则 RegExp 对象\nRegExp 对象序列化后为一个普通的 javascript 对象，同样不符合预期</li>\n<li>undefined\n序列化之后直接被过滤掉，丢失拷贝的属性</li>\n<li>NaN\n序列化之后为 null，同样不符合预期结果</li>\n</ul>\n<p>此方式拷贝对象因为有以上这么多缺陷，所以我们不如自己封装一个属于自己的 javascript 对象深拷贝的函数，反而一劳永逸。</p>\n<h2>手动封装对象深拷贝方法</h2>\n<p>对象属性的拷贝无疑就是把源对象的属性以深度遍历的方式复制到新的对象上，当遍历到一个属性值为对象类型的值时，就需要针对这个值进行再次的遍历，也是就用递归的方式遍历源对象的所有属性。让我们先看这一部分代码</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">cloneDeep</span><span class="token punctuation">(</span><span class="token parameter">obj</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> obj<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 判断key 是否是对象自身上的属性，以避免对象原型链上属性的拷贝</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>obj<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      result<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">cloneDeep</span><span class="token punctuation">(</span>obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment">//需要对属性值递归拷贝</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>这段代码是对象属性深拷贝的逻辑，但是不同的数据类型各自有其特殊的操作方式需要处理，下面就把这些处理边界场景的代码补充上，看看完成的代码应该是怎样的</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">isPrimitiveValue</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>\n    <span class="token keyword">typeof</span> value <span class="token operator">===</span> <span class="token string">\'string\'</span> <span class="token operator">||</span>\n    <span class="token keyword">typeof</span> value <span class="token operator">===</span> <span class="token string">\'number\'</span> <span class="token operator">||</span>\n    value <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span>\n    <span class="token keyword">typeof</span> value <span class="token operator">===</span> <span class="token string">\'boolean\'</span> <span class="token operator">||</span>\n    Number<span class="token punctuation">.</span><span class="token function">isNaN</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>\n  <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">return</span> <span class="token boolean">false</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">cloneDeep</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 判断拷贝的数据类型，如果为原始类型数据，直接返回其值</span>\n\n  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isPrimitiveValue</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> value\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 定义一个保存引用类型的变量,根据 引用数据类型不同的子类型初始化不同的值，以下对象类型的判断和初始化可以根据自身功能的需要做删减。这里列出了所有的引用类型的场景。</span>\n  <span class="token keyword">let</span> result\n\n  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> value <span class="token operator">===</span> <span class="token string">\'function\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// result=value 如果复制函数的时候需要保持同一个引用可以省去新函数的创建，这里用eval创建了一个原函数的副本</span>\n    result <span class="token operator">=</span> <span class="token function">eval</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">(</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>value<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">)</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    result <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token keyword">instanceof</span> <span class="token class-name">RegExp</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RegExp</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token keyword">instanceof</span> <span class="token class-name">Date</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token keyword">instanceof</span> <span class="token class-name">Number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Number</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token keyword">instanceof</span> <span class="token class-name">String</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token keyword">instanceof</span> <span class="token class-name">Boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Boolean</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> value <span class="token operator">===</span> <span class="token string">\'object\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>value<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">try</span> <span class="token punctuation">{</span>\n        result<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">cloneObject</span><span class="token punctuation">(</span>value<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment">//属性值为原始类型包装对象的时候，（Number,String,Boolean）这里会抛错，需要加一个错误处理，对运行结果没有影响。</span>\n      <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// console.error(error)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">return</span> result\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>代码中首先封装了一个判断数据是否是原始类型的方法，这里只是为了保持 cloneDeep 函数的功能干净，其实你也可以完全放到一块，这个完全取决于自己的编码风格。如果在业务上需要有多处判断数据是原始类型还是引用类型的场景时，以上这种代码功能抽离的方式就方便处理了。</p>\n<p>查看更多 Javascript 函数功能封装在 Github 仓库<a href="https://github.com/konglingwen94/handy-utilities">狠狠的点击这里</a></p>\n<p>备注：本片博文为作者原创，转载请标注出处，谢谢！</p>\n<p>作者：孔令文</p>',frontmatter:{title:"实现Javascript对象的深拷贝",date:"2020-4-05",category:"Javascript",tags:["工具"],cover:""}},site:{siteMetadata:{url:"https://konglingwen94.github.io",thumbnail:"",defaultAuthor:"孔令文",donation:{status:!0,channel:{alipay:"https://cdn-images-1.medium.com/max/1600/1*PZjwR1Nbluff5IMI6Y1T6g@2x.png",wechat:""}},share:!0}}},pathContext:{slug:"/deep-clone-object/",title:"实现Javascript对象的深拷贝",excerpt:"文章首发于 个人博客 前提 在处理日常的业务开发当中，数据拷贝是经常需要用到的。但是 javascript 提供的数据操作 Api 当中能实现对象克隆的都是浅拷贝，比如 Object.assign 和 ES6 新增的对象扩展运算符（...）,这两个 Api…",prev:!1,next:{fields:{slug:"/es3-call-apply/"},frontmatter:{title:"深入掌握 javascript 中的 this 能帮助我们做什么？",category:"Javascript",tags:["Javascript"],cover:"",date:"2020-04-18"},excerpt:"this 是什么 Javascript…"}}}}});
//# sourceMappingURL=path---articles-deep-clone-object-07876a50e158f3c4e3cf.js.map