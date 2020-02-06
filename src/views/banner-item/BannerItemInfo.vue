<template>
  <div class="container" v-loading="loading">
    <div class="title">
      <span>{{title}}</span>
      <span class="back" @click="back" v-if="action === 'edit'">
        <i class="iconfont icon-fanhui"></i> 返回
      </span>
    </div>
    <div class="wrap">
      <el-row>
        <el-col
          :lg="16"
          :md="20"
          :sm="24"
          :xs="24">
          <el-form
            :model="form"
            :rules="rules"
            status-icon
            ref="form"
            label-width="100px"
            @submit.native.prevent>
            <el-form-item label="主图" prop="image">
              <upload-imgs
                ref="uploadEle"
                :value="imgInitData"
                :rules="imgRules"
                :max-num="1"
              />
            </el-form-item>
            <el-form-item label="所属横幅" prop="banner_id">
              <el-select v-model="form.banner_id" placeholder="请选择所属横幅">
                <el-option
                  v-for="item in banners"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="导向类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择导向类型" @change="onChangeType">
                <el-option
                  v-for="(value, key) in types"
                  :key="key"
                  :label="value"
                  :value="parseInt(key)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="导向内容" prop="content_id" v-if="form.type !== 1">
              <el-cascader
                v-model="form.content_id"
                :options="contents"
                :props="{
                  expandTrigger: 'hover',
                  emitPath: false,
                  label: 'name',
                  value: 'id',
                  children: 'products'
                }">
              </el-cascader>
            </el-form-item>
            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import bannerItem from '@/models/banner-item.js'
import banner from '@/models/banner.js'
import category from '@/models/category.js'
import theme from '@/models/theme.js'
import UploadImgs from '@/components/base/upload-imgs'

export default {
  props: {
    editId: Number,
    action: {
      type: String,
      default: 'edit',
    },
  },
  components: {
    UploadImgs,
  },
  data() {
    return {
      form: {
        banner_id: '',
        type: '',
        content_id: '',
      },
      originInfo: null,
      rules: {
        banner_id: [
          { required: true, message: '请选择所属横幅', trigger: 'change' }, // eslint-disable-line
        ],
        type: [
          { required: true, message: '请选择导向类型', trigger: 'change' }, // eslint-disable-line
        ],
        // content_id: [
        //   { required: true, message: '请选择导向内容', trigger: 'change' },
        // ],
      },
      imgRules: {
        minWidth: 100,
        minHeight: 100,
      },
      imgInitData: [],
      banners: [],
      contents: [],
      types: [],
      loading: false,
    }
  },
  computed: {
    title() {
      return this.action === 'edit' ? '编辑横幅子项目' : '添加横幅子项目'
    },
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      if (this.action === 'edit' && this.editId) {
        this.loading = true
        try {
          this.originInfo = await bannerItem.get(this.editId)
          this.setInfo()
        } catch (err) {
          console.log(err)
        }
        this.loading = false
      }
      this.fillSelect()
    },
    async fillSelect() {
      try {
        this.banners = await banner.getAll()
        this.types = await bannerItem.getAllTypes()
        this.onChangeType()
      } catch (err) {
        console.log(err)
      }
    },
    setInfo() {
      const origin = this.originInfo  // eslint-disable-line
      Object.keys(origin).forEach((key) => {
        if (key in this.form) {
          this.form[key] = origin[key]
        }
      })
      if (origin.img_id && origin.image) {
        this.imgInitData.splice(0)
        this.imgInitData.push({
          id: origin.img_id,
          imgId: origin.img_id,
          display: origin.image,
        })
      }
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return
        }
        try {
          const imgData = await this.$refs.uploadEle.getValue()
          const noImgData = (Array.isArray(imgData) && imgData.length === 0) || !imgData
          if (noImgData) {
            this.$message.error('还没有上传主图文件或图片不符合规则')
            return
          }
          const data = Object.assign(this.form, { img_id: imgData[0].imgId })
          // console.log(data)
          let res = null
          if (this.editId) {
            res = await bannerItem.edit(this.editId, data)
          } else {
            res = await bannerItem.add(data)
          }
          if (res.error_code === 0) {
            this.$message.success(`${res.msg}`)
            this.resetForm(formName)
            this.$emit('edit-save')
          }
        } catch (error) {
          console.log(error)
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      if (this.action === 'edit') {
        this.setInfo()
      } else {
        this.$refs[formName].resetFields()
        this.imgInitData.splice(0)
      }
    },
    async onChangeType(value) {
      if (value) {
        this.form.content_id = 0
      }
      try {
        if (this.form.type === 1) {
          this.contents = []
          delete this.form.content_id
        } else if (this.form.type === 2) {
          this.contents = await category.getAllWithProducts()
        } else if (this.form.type === 3) {
          // const themes = await theme.getAll()
          // this.contents = themes.map(item => ({ label: item.name, value: item.id }))
          this.contents = await theme.getAll()
        }
      } catch (err) {
        console.log(err)
      }
    },
    back() {
      this.$emit('edit-back')
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
