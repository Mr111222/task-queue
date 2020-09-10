<template>
  <div class="box">
    <!-- <div class="Breadcrumb"></div> -->
    <div class="title">
      <div class="navBox">
        <a-steps :current="1" size="small">
          <a-step title="创建场景" />
          <a-step title="适配场景" />
          <a-step title="发布场景" />
        </a-steps>
      </div>
      <div class="left">
        <button class="commonBtn-else commonBtn-default" @click="goMenu">上一步</button>
        <button class="commonBtn-primary commonBtn-no" @click="addScene">下一步</button>
      </div>
    </div>
    <div class="content tit_shadow" :style="{height: boxHeight}" ref="content">
      <div class="content_box">
        <div class="list">
          <div class="listBox" v-for="(item, firIndex) in listData" :key="firIndex"
            :style="{'height':item.isShow ? '.8rem' : '3.22rem'}">
            <p class="titles">
              <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.mychecked" @change="firstChanged(firIndex)"></el-checkbox><span class="des"
                @click="showMenuFn(item)">{{item.topic || '其他'}}</span><i @click="showMenuFn(item)"
                class="el-icon-arrow-down" style="font-size: 0.14rem; margin-left: 0.08rem;"
                :class="item.isShow ? 'drop_operation180' : 'drop_operation0'"></i>
            </p>
            <div v-show="!item.isShow">
              <div class="listboxs listChild" style="float:left;" v-for="(lis, indexs) in item.listArr" :key="indexs">
                <div class="list_content">
                  <a class="linkUrl" :href="linkUrl" target="_blank">{{lis.type | getType}}</a>
                  <img :src="lis.showImg" alt="">
                  <el-checkbox class="checks" v-model="lis.mychecked" @change="secondChanged(firIndex)">
                  </el-checkbox>
                </div>
                <p class="sourceTitle">{{lis.name}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    data() {
      return {
        imgUrl: require('../../../../assets/image/modal.jpg'),
        indeterminate: true,
        checkAll: [],
        listData: [],
        oldData: [],
        types: [],
        checked: [],
        checkedAll: false,
        list_len: 0,
        boxHeight: 0
      };
    },
    computed: {
      ...mapGetters(['sencmsg']),
      linkUrl() {
        return `https://perform.citybase.qq.com/connect/static/modelview.html?url=https%3A%2F%2Fcfgateway.ifreedo.cn%2Ffreeserver-pmts%2Fservices%2Ff8cb23fe45834941b25ef091fd752cdc%2Fpmts%2F1.1.0%2FPMTSCapabilities.json?token=${this.GLOBAL.getUserToken()}`
      }
    },
    mounted() {
      this.boxHeight = document.documentElement.clientHeight - this.$refs.content.getBoundingClientRect().top - 70 +
        'px'
      if (this.sencmsg.list.checkAll && this.sencmsg.list.checkAll.length > 0) {
        if (typeof this.sencmsg.list.checkAll === 'string') {
          this.checkAll.push(this.sencmsg.list.checkAll)
        } else {
          this.checkAll = this.sencmsg.list.checkAll
        }
      }
      this.getList()
    },
    methods: {
      async getList() {
        let datas = await this.GLOBAL.requstCommonApi(
          `${this.GLOBAL.getServiceUrl().layer}service/layer/datasetlist?token=${this.GLOBAL.getUserToken()}`)
        if (datas.state.code === 10000) {
          let list = datas.body.message
          list.forEach(res => {
            if (!res.hasOwnProperty('topic')) {
              res.topic = ''
            }
            if (res.preview) {
              res.showImg = `${this.GLOBAL.getServiceUrl().map}service/map/dataset/preview?token=${res.preview}`
            } else {
              res.showImg = this.imgUrl
            }
          })

          // new
          if (this.checkAll.length > 0) {
            list.forEach(res => {
              this.checkAll.forEach(val => {
                if(res.id === val) {
                  res['mychecked'] = true // 判断 listArr 内数据是否选择
                  res['isIndeterminate'] = true
                }
              })
            })
          }
          // end
          let result = []
          result = list.reduce((all, next) => {
            var a = all.filter(res => res.topic == next.topic)
            return a.length > 0 ?
              (a[0].listArr.push({
                'id': `${next.id}`,
                'name': `${next.name}`,
                'type': `${next.type}`,
                'showImg': `${next.showImg}`,
                'mychecked': next.mychecked,
              }), all) : [...all, {
                'topic': next.topic,
                'listArr': [{
                  'id': `${next.id}`,
                  'name': `${next.name}`,
                  'type': `${next.type}`,
                  'showImg': `${next.showImg}`,
                  'mychecked': next.mychecked,
                }]
              }]
          }, []);
          for (var i = 0; i < result.length; i++) {
            let flag = true
            for (var j = 0; j < result[i].listArr.length; j++) {
              let listChild = result[i].listArr[j]
              if(listChild.mychecked === undefined) {
                flag = false
              }else{
                result[i]["isIndeterminate"] = true;
              }
              if(!result[i].listArr[j].hasOwnProperty('mychecked')) {
                result[i].listArr[j]["mychecked"] = false;
              }
            }
            if(flag) {
              result[i]["mychecked"] = true;
              result[i]["isIndeterminate"] = false;
            }else{
              result[i]["mychecked"] = false;
            }
          }
          console.log(result, 'result ')
          this.listData = result
        }
      },
      // formData
      formData(arr) {
        var oldDataRule = []
        arr.forEach(el => {
          var oldObj = {
            name: el.name,
            list: []
          }
          var cityObj = el.list
          var sourceName = el.sourceName
          var type = el.type

          // oldObj.list.push(cityObj)
          oldObj.list.push({
            id: cityObj,
            sourceName: sourceName,
            type: type
          })
          oldDataRule.push(oldObj)
        })
        var newData = []
        var newObj = {}
        oldDataRule.forEach((el, i) => {
          if (!newObj[el.name]) {
            newData.push(el);
            newObj[el.name] = true;
          } else {
            newData.forEach(el => {
              if (el.name === oldDataRule[i].name) {
                el.list = el.list.concat(oldDataRule[i].list);
              }
            })
          }
        })
        return newData
      },
      firstChanged(index) {
        //一级未选中 则对应的二级都不选中
        if (this.listData[index].mychecked == false) {
          var childrenArray = this.listData[index].listArr;
          if (childrenArray) {
            for (var i = 0, len = childrenArray.length; i < len; i++) {
              childrenArray[i].mychecked = false;
            }
          } //一级选中  则对应的二级都选中
        } else if (this.listData[index].mychecked = true) {
          this.listData[index].isIndeterminate = false;
          var childrenArray = this.listData[index].listArr;
          if (childrenArray) {
            for (var i = 0, len = childrenArray.length; i < len; i++) {
              childrenArray[i].mychecked = true;
            }
          }          
        }
        console.log(this.listData[index], 88)
      },
      //二级change事件
      secondChanged(firIndex) {
        var childrenArray = this.listData[firIndex].listArr;
        var tickCount = 0,
          unTickCount = 0,
          len = childrenArray.length
        for (var i = 0; i < len; i++) {
          if (childrenArray[i].mychecked == true) {
            tickCount++;
            this.listData[firIndex].isIndeterminate = true;
          }
          if (childrenArray[i].mychecked == false) {
            unTickCount++;
            this.listData[firIndex].isIndeterminate = true;
          }
        }
        if (tickCount == len) { //二级全勾选  一级勾选            
          this.listData[firIndex].mychecked = true;
          this.listData[firIndex].isIndeterminate = false;
        } else { //二级未全选  一级不勾选
          this.listData[firIndex].mychecked = false;
          this.listData[firIndex].isIndeterminate = true;
        }

        if(unTickCount ==  len) {
          this.listData[firIndex].isIndeterminate = false;
        }
      },
      handleClassfiySure() {
        this.checkAll = []
        this.checkedClassifyName = [];
        for (var i = 0; i < this.listData.length; i++) {
          var serviceClassEntitys = this.listData[i].listArr;
          var len = serviceClassEntitys.length;
          for (var j = 0; j < len; j++) {
            if (serviceClassEntitys[j].mychecked == true) {
              this.checkAll.push(serviceClassEntitys[j].id);
              this.checkedClassifyName.push(serviceClassEntitys[j].name)
            }
          }
        }

        //判断勾选的品类是否为空，为空的话显示全部
        if (this.checkAll.length == 0) {
          for (var i = 0; i < this.listData.length; i++) {
            var serviceClassEntitys = this.listData[i].listArr
            for (var j = 0; j < serviceClassEntitys.length; j++) {
              this.checkedClassifyName.push(serviceClassEntitys[j].name);
            }
          }
        }
      },
      // 确定按钮
      addScene() {
        this.handleClassfiySure()
        if (this.checkAll.length === 0) {
          this.$message({
            type: 'error',
            message: '组装场景不能为空，请选择'
          })
          return
        } else if (this.sencmsg.scenames == null) {
          this.$message.error('场景名称不能为空，请返回上一步')
        } else {
          this.$router.push({
            name: 'newAdd'
          })
          var defArr = []
          this.checkAll.forEach(p => {
            this.listData.forEach(li => {
              li.listArr.forEach(arr => {
                if (p === arr.id) {
                  defArr.push({
                    name: li.topic,
                    list: arr.id,
                    sourceName: arr.name,
                    type: arr.type
                  })
                }
              })
            })
          })
          this.checkAll.forEach(res => {
            this.oldData.forEach(old => {
              if (res === old.id) {
                this.types.push(old.type)
              }
            })
          })
          this.$store.dispatch('getSenList', {
            listData: this.formData(defArr),
            checkAll: this.checkAll,
            types: this.types
          })
        }

      },
      // 取消按钮
      addCancel() {
        this.$router.push('/admin/scene')
        this.$store.dispatch('clearData')
      },
      showMenuFn(item) {
        if (!item.isShow) {
          this.$set(item, 'isShow', false)
          item.isShow = !item.isShow
        } else {
          item.isShow = !item.isShow
        }
      },
      // checkbox
      checkBoxAll($event, groupType) {
        var arr = this.checkAll;
        if ($event.target.checked == true) {
          this.$refs[groupType].forEach((item, index, input) => {
            item.checked = true;
            if (arr.indexOf(item.value) == -1) {
              arr.push(item.value);
            }
          })
        } else {
          this.$refs[groupType].forEach((item, index, input) => {
            item.checked = true;
            var indexToDel = arr.indexOf(item.value)
            if (indexToDel != -1) {
              arr.splice(indexToDel, 1)
            }
          })
        }
      },
      goMenu() {
        this.$router.push('/admin/newscene')
      },
    },
    filters: {
      getType(val) {
        let type = ''
        switch (val) {
          case '01':
            type = 'pmts'
            break;
          case '02':
            type = 'wmts'
            break;
          case '03':
            type = 'wets'
            break;
          default:
            type = val
            break;
        }
        return type.toLocaleUpperCase()
      }
    },
  };
</script>

<style scoped lang='scss'>
  .box {
    .content {
      overflow: hidden;
      overflow-y: auto;

      .content_box {
        .newBox {
          width: 6.03rem;
          margin: .4rem auto .56rem auto;
        }
      }
    }
  }

  .navBox {
    width: 6.03rem;
    margin: .24rem auto;
    padding-top: .25rem;
  }

  .list {
    overflow: hidden;

    .listBox {
      position: relative;
      height: 3.22rem;
      margin-left: 0.32rem;
      margin-right: 0.32rem;
      margin-bottom: .25rem;
      clear: both;
      border-bottom: 1px solid rgba(220, 220, 221, 1);

      .titles {
        width: 1.8rem;
        height: 0.25rem;
        font-size: 18px;
        font-weight: 400;
        color: rgba(101, 112, 138, 1);
        line-height: 25px;

        .des {
          margin-left: 0.03rem;
          font-size: 0.18rem;
          font-weight: 400;
          color: #65708A;
          /* vertical-align: top; */
        }
      }

      .listboxs {
        width: 1.94rem;
        height: 2.7rem;
        margin-right: 0.32rem;

        .list_content {
          width: 1.94rem;
          height: 1.94rem;
          background: #eee;
          border-radius: 4px;
          border: 1px solid rgba(196, 196, 198, 1);
          position: relative;
          text-align: center;
          line-height: 1.94rem;

          .linkUrl {
            display: none;
          }

          &:hover {
            background: rgba(62, 125, 228, 1);
            opacity: 0.5;

            .linkUrl {
              display: block;
            }
          }

          img {
            width: 60%;
            height: 90%;
            /* margin-left: 15px; */
            vertical-align: middle;
          }
        }

        .sourceTitle {
          width: 1.94rem;
          height: 0.27rem;
          margin-top: 0.08rem;
          font-size: 16px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 0.27rem;
          text-align: center;
        }
      }

      .listChild {
        position: relative;

        a {
          position: absolute;
          font-size: 18px;
          border-radius: 50%;
          z-index: 99;
          width: 40px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          top: 50%;
          left: 50%;
          margin-top: -20px;
          margin-left: -20px;
          font-weight: 400;
          color: rgba(220, 220, 221, 1);
        }

        .checks {
          position: absolute;
          width: 24px;
          height: 24px;
          top: -55px;
        }
      }
    }
  }
</style>