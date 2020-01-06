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
                v-model="form.name"
                placeholder="请填写产品名"
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
            <el-form-item label="摘要" prop="summary">
              <el-input
                size="medium"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 3}"
                placeholder="请填写产品摘要"
                clearable
                maxlength="50"
                show-word-limit
                v-model.trim="form.summary">
              </el-input>
            </el-form-item>
            <el-form-item label="分类" prop="category_id">
              <el-select v-model="form.category_id" placeholder="请选择分类">
                <el-option
                  v-for="item in categories"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="主题" prop="theme_ids">
              <el-select v-model="form.theme_ids" multiple placeholder="请选择主题">
                <el-option
                  v-for="item in themes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="参数" prop="params">
              <div class="block-box">
                <i class="iconfont icon-jia plus" v-if="!form.params.length" @click="addParams"></i>
                <el-row class="input-row" v-for="(item,index) in form.params" :key="index">
                  <el-input
                    v-model="item.name"
                    placeholder="请输入产品参数名"
                    size="medium"
                    class="input-detail"
                  ></el-input>
                  <el-input
                    v-model="item.detail"
                    placeholder="请输入产品参数值"
                    size="medium"
                    class="input-detail"
                    ></el-input>
                  <div class="function">
                    <i class="iconfont icon-jian1 minus" @click="removeParams(index)"></i>
                    <i class="iconfont icon-jia plus" v-if="index === form.params.length-1" @click="addParams"></i>
                  </div>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="旧价格" prop="old_price_str">
              <el-input
                size="medium"
                type="number"
                v-model.trim="form.old_price_str"
                placeholder="请填写旧价格"
              ></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price_str">
              <el-input
                size="medium"
                type="number"
                v-model.trim="form.price_str"
                placeholder="请填写价格"
              ></el-input>
            </el-form-item>
            <el-form-item label="库存" prop="stock">
              <el-input
                size="medium"
                type="number"
                v-model.number="form.stock"
                placeholder="请填写库存"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品描述图" prop="image">
              <upload-imgs
                ref="uploadDescEle"
                :value="descImgInitData"
                :rules="imgRules"
                multiple
                sortable
              />
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
import product from '@/models/product.js'
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
        name: '',
        category_id: '',
        theme_ids: [],
        summary: '',
        old_price_str: '',
        price_str: '',
        stock: '',
        params: [],
      },
      originInfo: null,
      rules: {
        name: [
          { required: true, message: '请输入标题', trigger: 'blur' }, // eslint-disable-line
          { min: 1, max: 30, message: '标题长度是1 - 30个字符', trigger: 'blur' },  // eslint-disable-line
        ],
        category_id: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
        // theme_ids: [
        //   { required: true, message: '请选择主题', trigger: 'change' },
        // ],
        summary: [
          { required: true, message: '请输入摘要', trigger: 'blur' }, // eslint-disable-line
          { min: 1, max: 50, message: '摘要长度是1 - 50个字符', trigger: 'blur' },  // eslint-disable-line
        ],
        old_price_str: [
          { pattern: /^\d+\.\d{2}$/, message: '价格格式类似: 1.20', trigger: 'blur' },
        ],
        price_str: [
          { required: true, message: '请输入产品价格', trigger: 'blur' },
          { pattern: /^\d+\.\d{2}$/, message: '价格格式类似: 1.20', trigger: 'blur' },
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: 'blur' },
          { type: 'number', min: 0, message: '库存大于等于0', trigger: 'blur' },  // eslint-disable-line
        ],
      },
      imgRules: {
        minWidth: 100,
        minHeight: 100,
      },
      imgInitData: [],
      descImgInitData: [],
      loading: false,
      categories: [],
      themes: [],
    }
  },
  computed: {
    title() {
      return this.action === 'edit' ? '编辑产品' : '添加产品'
    },
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      try {
        this.categories = await category.getAll()
        this.themes = await theme.getAll()
      } catch (err) {
        console.log(err)
      }
      if (this.action === 'edit' && this.editId) {
        this.loading = true
        try {
          this.originInfo = await product.get(this.editId)
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
      if (Array.isArray(origin.desc_imgs) && origin.desc_imgs.length > 0) {
        this.descImgInitData.splice(0)
        origin.desc_imgs.sort((a, b) => a.order - b.order)
        origin.desc_imgs.forEach((item) => {
          this.descImgInitData.push({
            id: item.img_id,
            imgId: item.img_id,
            display: item.image,
          })
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
          const descImgData = await this.$refs.uploadDescEle.getValue()
          const noImgData = (Array.isArray(imgData) && imgData.length === 0) || !imgData
          // const noDescImgData = (Array.isArray(descImgData) && descImgData.length === 0) || !descImgData
          if (noImgData) {
            this.$message.error('还没有上传主图文件或图片不符合规则')
            return
          }
          // if (noDescImgData) {
          //   this.$message.error('还没有上传产品描述图文件或图片不符合规则')
          //   return
          // }
          const data = Object.assign(this.form, { img_id: imgData[0].imgId })
          if (Array.isArray(descImgData) && descImgData.length !== 0) {
            data.desc_img_ids = descImgData.map((item) => item.imgId)
          }
          // console.log(data.desc_img_ids)
          let res = null
          if (this.editId) {
            res = await product.edit(this.editId, data)
          } else {
            res = await product.add(data)
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
    back() {
      this.$emit('edit-back')
    },
    addParams() {
      this.form.params.push({
        text: '',
        type: 'plus',
      })
    },
    removeParams(index) {
      this.form.params.splice(index, 1)
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
