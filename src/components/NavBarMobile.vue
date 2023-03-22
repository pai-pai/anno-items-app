<script>
  export default {
    name: "NavBarMobile",
  }
</script>

<template>
  <div>
    <ul>
      <li><router-link to="/equip-expedition">Equip an Expedition</router-link></li>
      <li><router-link to="/items">Items</router-link></li>
      <li><router-link to="/ships">Ships</router-link></li>
      <li><router-link to="/supplies">Supplies</router-link></li>
    </ul>
  </div>
</template>

<style scoped>
  ul {
    list-style-type: none;
    padding-left: 4.5rem;
    padding-top: 1rem;
  }

  ul li {
    line-height: 3rem;
  }

  ul li a {
    color: #FFFEFB;
    font-size: 1.25rem;
    text-decoration: none;
  }

  ul li a:hover,
  ul li a.router-link-exact-active {
    color: #37A298;
  }
</style>