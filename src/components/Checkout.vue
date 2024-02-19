<template>
  <div v-if="sortedCart.length === 0" class="container p-5">
    <button class="btn btn-warning" v-on:click="goToHome">
      Back to Home Page
    </button>
  </div>
  <div v-else class="container p-5">
    <div v-for="Lesson in sortedCart" class="d-flex p-2">
      <div class="p-2">
        <figure>
          <img :src="getLessonImageUrl(Lesson.image)" alt="Lesson Image" />
        </figure>
      </div>
      <div class="p-3">
        <h2 v-text="Lesson.subject"></h2>
        <p v-text="Lesson.location"></p>
        <p>Price: {{ Lesson.price }}</p>
        <p>Quantity: {{ Lesson.quantity }}</p>
        <button class="btn btn-danger" v-on:click="emitRemoveFromCart(Lesson)">
          Remove
        </button>

        <div>
          <span v-for="n in Lesson.rating">★</span>
          <span v-for="n in 5 - Lesson.rating">☆</span>
        </div>
      </div>
    </div>
  </div>
  <!-- Checkout page -->
  <h2>Checkout</h2>
  <div class="mb-3 mt-3">
    <p>
      <strong>Your Full Name:</strong>
      <!-- regular expressions -->
      <input
        class="form-control"
        pattern="[a-zA-Z]+"
        title="Only text input is allowed"
        required
        oninput="this.value = this.value.replace(/[^a-zA-Z- ]/g, '')"
        v-model="order.FullName"
        placeholder="letters only"
      />
      <span
        v-if="!order.isNameValid && order.FullName.length === 0"
        class="text-danger"
        >Name is required</span
      >
      <span
        v-if="!order.isNameValid && order.FullName.length > 0"
        class="text-danger"
        >Invalid name</span
      >
    </p>
  </div>
  <div>
    <p>
      <strong>Phone Number:</strong>
      <!-- regular expressions -->
      <input
        class="form-control"
        pattern="[0-9]+"
        title="Only numbers input is allowed"
        required
        oninput="this.value = this.value.replace(/[^0-9-+]/g, '')"
        v-model="order.PhoneNumber"
        placeholder="numbers only"
      />
      <span
        v-if="!order.isPhoneValid && order.PhoneNumber.length === 0"
        class="text-danger"
        >Phone number is required</span
      >
    </p>
  </div>
  <h2>Order Information</h2>
  <p>Full Name: {{ order.FullName }}</p>
  <p>Phone Number: {{ order.PhoneNumber }}</p>
  <button class="btn btn-primary" v-on:click="submitForm">Place Order</button>
</template>

<script>
export default {
  props: {
    sortedCart: Array, // Array of cart items
    goToHome: Function,
    getLessonImageUrl: Function,
    order: Object,
    submitForm: Function,
  },
  methods: {
    emitRemoveFromCart(lesson) {
      // Emit an event to trigger adding the lesson to cart in the parent component
      this.$emit("remove-item-from-cart", lesson);
    },
  },
};
</script>

<style scoped>
/* Your scoped styles */
</style>
