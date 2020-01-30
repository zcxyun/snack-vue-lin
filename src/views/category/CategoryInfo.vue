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
            <el-form-item label="名字" prop="name">
              <el-input
                size="medium"
                v-model.trim="form.name"
                placeholder="请填写分类名"
                maxlength="30"
                clearable
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="主图" prop="image">
              <upload-imgs
                ref="uploadEle"
                :value="imgInitData"
                :rules="imgRules"
                :max-num="1"
              />
            </el-form-item>
            <el-form-item label="小图" prop="mini_image">
              <upload-imgs
                ref="uploadMiniEle"
                :value="miniImgInitData"
                :rules="miniImgRules"
                :max-num="1"
              />
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
              <el-input
                size="medium"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 3}"
                placeholder="请填写分类摘要"
                clearable
                maxlength="50"
                show-word-limit
                v-model.trim="form.summary">
              </el-input>
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
import category from '@/models/category.js'
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
        name: '',
        summary: '',
      },
      originInfo: null,
      rules: {
        name: [
          { required: true, message: '请输入标题', trigger: 'blur' }, // eslint-disable-line
          { min: 1, max: 30, message: '标题长度是1 - 30个字符', trigger: 'blur' },  // eslint-disable-line
        ],
        summary: [
          { required: true, message: '请输入摘要', trigger: 'blur' }, // eslint-disable-line
          { min: 1, max: 50, message: '摘要长度是1 - 50个字符', trigger: 'blur' },  // eslint-disable-line
        ],
      },
      imgInitData: [],
      imgRules: {
        minWidth: 100,
        minHeight: 100,
      },
      miniImgInitData: [],
      miniImgRules: {
        minWidth: 100,
        minHeight: 100,
      },
      loading: false,
    }
  },
  computed: {
    title() {
      return this.action === 'edit' ? '编辑分类' : '添加分类'
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
          this.originInfo = await category.get(this.editId)
          this.setInfo()
        } catch (err) {
          console.log(err)
        }
        this.loading = false
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
      if (origin.mini_img_id && origin.mini_image) {
        this.miniImgInitData.splice(0)
        this.miniImgInitData.push({
          id: origin.mini_img_id,
          imgId: origin.mini_img_id,
          display: origin.mini_image,
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
          const miniImgData = await this.$refs.uploadMiniEle.getValue()
          const noImgData = (Array.isArray(imgData) && imgData.length === 0) || !imgData
          const noMiniImgData = (Array.isArray(miniImgData) && miniImgData.length === 0) || !miniImgData
          if (noImgData) {
            this.$message.error('还没有上传主图或图片不符合规则')
            return
          }
          if (noMiniImgData) {
            this.$message.error('还没有上传小图或图片不符合规则')
            return
          }
          const data = Object.assign(this.form, {
            img_id: imgData[0].imgId,
            mini_img_id: miniImgData[0].imgId,
          })
          let res = null
          if (this.editId) {
            res = await category.edit(this.editId, data)
          } else {
            res = await category.add(data)
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
        this.miniImgInitData.splice(0)
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
