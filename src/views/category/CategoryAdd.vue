<template>
  <div>
    <category-info action="add" @edit-save="onEditSave"></category-info>
  </div>
</template>

<script>
import CategoryInfo from './CategoryInfo'

export default {
  components: {
    CategoryInfo,
  },
  methods: {
    onEditSave() {
      this.$router.push('/category/list')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
