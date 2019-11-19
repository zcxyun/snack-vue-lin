<template>
  <div>
    <product-info action="add" @edit-save="onEditSave"></product-info>
  </div>
</template>

<script>
import ProductInfo from './ProductInfo'

export default {
  components: {
    ProductInfo,
  },
  methods: {
    onEditSave() {
      this.$router.push('/product/list')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
