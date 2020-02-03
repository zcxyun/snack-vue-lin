<template>
  <div class="container" v-loading="loading">
    <div class="title">
      <span>订单信息</span>
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
            status-icon
            ref="form"
            label-width="100px"
            @submit.native.prevent>
            <el-form-item label="订单名" prop="snap_name">
              <el-input disabled v-model="form.snap_name" />
            </el-form-item>
            <el-form-item label="订单号" prop="order_no">
              <el-input disabled v-model="form.order_no"></el-input>
            </el-form-item>
            <el-form-item label="主图" prop="image">
              <upload-imgs
                ref="uploadEle"
                :value="imgInitData"
                :rules="imgRules"
                disabled
              />
            </el-form-item>
            <el-form-item label="下单时间" prop="create_time_str">
              <el-input disabled v-model="form.create_time_str"></el-input>
            </el-form-item>
            <el-form-item label="订单状态" prop="order_status_desc">
              <el-input disabled v-model="form.order_status_desc"></el-input>
            </el-form-item>
            <el-form-item label="总金额" prop="total_price_str">
              <el-input disabled v-model="form.total_price_str"></el-input>
            </el-form-item>
            <el-form-item label="原总金额" prop="old_total_price_str">
              <el-input disabled v-model="form.old_total_price_str"></el-input>
            </el-form-item>
             <el-form-item label="总数量" prop="total_count">
              <el-input disabled v-model="form.total_count"></el-input>
            </el-form-item>
            <el-form-item label="地址信息" prop="snap_address">
              <el-table :data="[form.snap_address]" style="width: 100%">
                <template v-for="col in addressColumns">
                  <el-table-column
                    :key="col.label"
                    :label="col.label"
                    :prop="col.prop"
                    :width="col.width ? col.width : ''"
                    :fixed="col.fixed ? col.fixed : false"
                    show-overflow-tooltip
                  ></el-table-column>
                </template>
              </el-table>
            </el-form-item>
            <el-form-item label="产品信息" prop="snap_products">
              <el-table :data="form.snap_products" style="width: 100%">
                <template v-for="col in productColumns">
                  <el-table-column
                    v-if="col.isImage"
                    :key="col.label"
                    :label="col.label"
                    :fixed="col.fixed ? col.fixed : false"
                    :width="col.width ? col.width : ''">
                    <template #default="{row}">
                      <el-image
                        :src="row[col.prop]"
                        fit="contain"
                        @click.native="onImage(row[col.prop])"
                        ></el-image>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-else
                    :key="col.label"
                    :label="col.label"
                    :prop="col.prop"
                    :width="col.width ? col.width : ''"
                    :fixed="col.fixed ? col.fixed : false"
                    show-overflow-tooltip
                  ></el-table-column>
                </template>
              </el-table>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import orderModel from '@/models/order.js'
import UploadImgs from '@/components/base/upload-imgs'
import { addressColumns, productColumns } from './data.js'

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
        snap_name: '',
        order_no: '',
        create_time_str: '',
        order_status_desc: '',
        total_price_str: '',
        old_total_price_str: '',
        total_count: 0,
        snap_address: {},
        snap_products: [],
      },
      addressColumns,
      productColumns,
      originInfo: null,
      imgInitData: [],
      imgRules: {
        minWidth: 100,
        minHeight: 100,
      },
      loading: false,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      if (this.action === 'edit' && this.editId) {
        this.loading = true
        try {
          this.originInfo = await orderModel.get(this.editId)
          if (this.originInfo) {
            this.setInfo()
          }
        } catch (err) {} // eslint-disable-line
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
      this.form.snap_address = JSON.parse(this.form.snap_address)
      this.form.snap_products = JSON.parse(this.form.snap_products)
      if (origin.snap_img) {
        this.imgInitData.splice(0)
        this.imgInitData.push({
          id: 1,
          imgId: 1,
          display: origin.snap_img,
        })
      }
    },

    // 预览图片
    onImage(image) {
      if (typeof image === 'string' && image) {
        this.$imagePreview({ images: [image] })
      }
    },

    back() {
      this.$emit('back')
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
