<script>
  export default {
    name: "NavBar",
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
  }

  ul li {
    display: inline;
    margin-right: 3.125rem;
  }

  ul li a {
    color: #574D44;
    font-size: 1.25rem;
    text-decoration: none;
  }

  ul li a.router-link-exact-active {
    color: #81ACB1;
  }
</style>