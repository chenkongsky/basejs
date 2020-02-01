        // 生成canvas折线图
        drawCanvas() {
                const context = this.$refs.canvas.getContext("2d");
                let _width = this.$refs.canvas.offsetWidth;
                let _height = this.$refs.canvas.offsetHeight;
                let _tabName = this.tabList.find(
                    item => item.value == this.selectedLabel
                ).label;
                if (
                    !['a'].includes(_tabName) // 是否清除画布
                ) {
                    context.clearRect(
                        0,
                        0,
                        this.$refs.canvas.width,
                        this.$refs.canvas.height
                    );
                    return;
                }
                if (window.devicePixelRatio) {
                    let scale = window.devicePixelRatio;
                    this.$refs.canvas.width = _width * scale;
                    this.$refs.canvas.height = _height * scale;
                    context.scale(scale, scale);
                }
                context.beginPath();
                context.strokeStyle = "#d99513";
                let _oneHeight = (_height / this.tabData.length).toFixed(4) * 1;
                let _oneWidth = (_width / this.thList.length).toFixed(4) * 1;
                this.tabData.forEach((item, index) => {
                    if (index === this.tabData.length - 1) return;
                    let _startIndex = item[this.selectedLabel].findIndex(
                        item => item == 0
                    );
                    let _endIndex = this.tabData[index + 1][
                        this.selectedLabel
                    ].findIndex(item => item == 0);
                    let _radius = 0;
                    if (_endIndex - _startIndex > 0) {
                        _radius = -0.2;
                    } else if (_endIndex - _startIndex > 0) {
                        _radius = 0.2;
                    }
                    let _startX = this.$NP.times(
                        _oneWidth,
                        _startIndex - _radius + 0.5
                    );
                    let _startY = this.$NP.times(_oneHeight, index + 0.7);
                    let _endX = this.$NP.times(
                        _oneWidth,
                        _endIndex + _radius + 0.5
                    );
                    let _endY = this.$NP.times(_oneHeight, index + 1.3);
                    context.moveTo(_startX, _startY);
                    context.lineTo(_endX, _endY);
                    context.stroke();
                });
            },
            // 排列组合方法 [[1,2],[1,3]] => ["1,1", "1,3", "2,1", "2,3"]
            paiLie(arr, index = 0) {
                let results = [];
                let result = [];
                (function doExchange(arr, index) {
                    for (var i = 0; i < arr[index].length; i++) {
                        result[index] = arr[index][i];
                        if (index != arr.length - 1) {
                            doExchange(arr, index + 1);
                        } else {
                            results.push(result.join(","));
                        }
                    }
                })(arr, index);
                return results;
            },
            // [1,2,3,4],2 =>  [[1, 2],[1, 3],[1, 4],[2, 3],[2, 4],[3, 4]]
            paiLies(arr, size) {
                if (size > arr.length) {
                    throw Error(`"size" 不能大于 ${arr.length}`);
                }
                let result = [];
                (function loop(unselectedList, selectedList = []) {
                    unselectedList.forEach((selected, i) => {
                        let newSelectedList = [...selectedList, selected];
                        let newUnselectedList = unselectedList.filter(
                            (_, j) => j > i
                        );
                        if (newSelectedList.length === size) {
                            result.push(newSelectedList);
                            return;
                        }
                        loop(newUnselectedList, newSelectedList);
                    });
                })(arr);
                return result;
            },

//自定义拖拽指令 
Vue.directive('drag',{
    bind: function (el, binding) {
        var touch,disX,disY
        el.ontouchstart = (e) => {
            if(e.touches){
                touch = e.touches[0];
            }else {
                touch = e;
            }
            disX = touch.clientX - el.offsetLeft
            disY = touch.clientY - el.offsetTop;
        }
        el.ontouchmove = (e)=>{
            if(e.touches){
                touch = e.touches[0];
            }else {
                touch = e;
            }
          
            let left = touch.clientX - disX;
            let top = touch.clientY - disY;
            left = Math.min(Math.max(left, 0), document.documentElement.clientWidth - el.offsetWidth)
            top = Math.min(Math.max(top, 0), document.documentElement.clientHeight - el.offsetHeight -  70 * (document.documentElement.clientWidth / 375))
            //移动当前元素
            el.style.left = left + 'px';
            el.style.top = top + 'px';
            e.preventDefault();
        };
        el.ontouchend = (e) => {
        };
      }
  })
  
  Vue.directive('NoTouchMove', {
    bind (el) {
      el.addEventListener('touchmove', function (evt) {
        evt.stopPropagation()
        evt.preventDefault()
        return false
      }, false)
    }
  })
  
  Vue.directive('StopTouchMove', {
    bind (el) {
      el.addEventListener('touchstart', function (evt) {
        evt.stopPropagation()
      }, false)
      el.addEventListener('touchmove', function (evt) {
        evt.stopPropagation()
      }, false)
    }
  }),
  //富文本发送
  let that = this
  let keyEnter = this.$refs.editorDIV // document.getElementById('#editor_id')
  // console.log('keyEnter===', keyEnter)
  // 监听事件 键盘按下触发 document.getElementById('#editor_id')
  keyEnter.$el.addEventListener('keydown', function (e) {
    e = e || window.event
    let keyCode = e.keyCode || e.which || e.charCode
    let ctrlKey = e.ctrlKey || e.metaKey
    // 判断 ctrl+enter 发送
    if (ctrlKey && keyCode === 13) {
      // 点击 发送按钮  注册单击事件
      // $('body').on('click', '#editor_id', function () {
      // })
      that.$refs.editorDIV.setConten(that.text + '<p><br></p>')
    } else if (keyCode === 13) {
      // 阻止提交自动换行
      e.preventDefault()
      that.sendMsg()
      // 获取发送按钮id，调用 发送按钮事件
      // document.getElementById("rong-sendBtn").click()
    }
  })
})
  