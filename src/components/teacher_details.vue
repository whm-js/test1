<template>

</template>

<script>
    export default {
        name: '',
        components: {},
        data(){
            return{
            }
        },
        methods:{

        },
      created(){

      },
      activated(){
        this.$store.commit('updatateacher_indexSelected','teacher_details');
      }
    }
</script>

<style>

</style>
