<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="userData.username" placeholder="Username" required />
      <input v-model="userData.email" type="email" placeholder="Email" required />
      <input
        v-model="userData.password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: {
        username: '',
        email: '',
        password: '',
      },
    };
  },
  methods: {
    async handleRegister() {
      try {
        await this.$store.dispatch('auth/register', this.userData);
        alert('Registration successful! Please login.');
        this.$router.push('/login');
      } catch (error) {
        alert('Registration failed. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
