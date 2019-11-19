<template>
  <div>
    <theme-info action="add" @edit-save="onEditSave"></theme-info>
  </div>
</template>

<script>
import ThemeInfo from './ThemeInfo'

export default {
  components: {
    ThemeInfo,
  },
  methods: {
    onEditSave() {
      this.$router.push('/theme/list')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
