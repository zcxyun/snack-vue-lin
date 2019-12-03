<template>
  <div>
    <banner-item-info action="add" @edit-save="onEditSave"></banner-item-info>
  </div>
</template>

<script>
import BannerItemInfo from './BannerItemInfo'

export default {
  components: {
    BannerItemInfo,
  },
  methods: {
    onEditSave() {
      this.$router.push('/banner-item/list')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
