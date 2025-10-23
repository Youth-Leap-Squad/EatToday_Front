<template>
    <v-header class="header" :color="headerColor">
       <v-container>
        <v-row align="center" no-gutters>
            <v-col cols="25" md="6">
             <v-img src="@/assets/images/logo.png" max-height="28" width="28" contain/>
            <h1 class="header-title">오늘 뭐랑?</h1>
            </v-col>
            
        <v-col cols="12" md="6" class="d-flex justify-center">
          <div class="nav-main">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/lounge">Lounge</RouterLink>
            <RouterLink to="/event">Event</RouterLink>
          </div>
        </v-col>

    <h2>Home</h2>

    <h2>Rounge</h2>

    <h2>Event</h2>






            </v-row>
        </v-container> 
    </v-header>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>