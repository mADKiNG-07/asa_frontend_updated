<template>
  <!-- Lesson component template code -->
  <!--  Sorting category -->
  <div class="p-3">
    <select
      class="btn btn-dark dropdown-toggle"
      data-toggle="dropdown"
      v-model="sortBy"
      @change="emitSortBy"
    >
      <option disabled value="default">Choose your preference</option>
      <option value="Price">Price</option>
      <option value="Location">Location</option>
      <option value="Spaces">Spaces</option>
      <option value="Subject">Subject</option>
    </select>
    <button class="btn btn-dark" @click="sortData">
      <span class="fas fa-long-arrow-alt-up"></span>
    </button>
    <button class="btn btn-dark" @click="sortDataDesc">
      <span class="fas fa-long-arrow-alt-down"></span>
    </button>
  </div>
  <!-- lessons is also filteredAndSortedLessons -->
  <div v-for="lesson in lessons" class="d-flex p-2">
    <div class="p-2">
      <figure>
        <img :src="getLessonImageUrl(lesson.image)" alt="Lesson Image" />
      </figure>
    </div>
    <div class="p-3">
      <h2 v-text="lesson.subject"></h2>
      <p v-text="lesson.location"></p>
      <p>Price: {{ lesson.price }}</p>
      <p v-if="lesson.spaces === cartCount(lesson.id)"></p>
      <p v-else>
        This Lesson space remains
        {{ lesson.spaces - cartCount(lesson.id) }} spaces
      </p>
      <button
        class="btn btn-primary"
        @click="emitAddToCart(lesson)"
        v-if="canAddToCart(lesson)"
      >
        Add to cart
      </button>
      <button class="btn btn-secondary" disabled="disabled" v-else>
        Add to cart
      </button>
      <span v-if="lesson.spaces === cartCount(lesson.id)"
        >No more available spaces!</span
      >
      <span v-else-if="lesson.spaces - cartCount(lesson.id) < 5"
        >Only few left!</span
      >
      <span v-else>Buy now!</span>
      <div>
        <span v-for="n in lesson.rating">★</span>
        <span v-for="n in 5 - lesson.rating">☆</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["sort-by-change", "add-item-to-cart"],
  props: {
    lessons: Array, // Pass lessons array as a prop
    getLessonImageUrl: Function,
    cartCount: Function,
    canAddToCart: Function,
    sortData: Function,
    sortDataDesc: Function,
  },
  data() {
    return {
      sortBy: "default", // Define the sortBy property with a default value
    };
  },
  methods: {
    emitSortBy() {
      // Emit an event to pass sortBy value to the parent component
      this.$emit("sort-by-change", this.sortBy);
    },
    emitAddToCart(lesson) {
      // Emit an event to trigger adding the lesson to cart in the parent component
      this.$emit("add-item-to-cart", lesson);
    },
  },
};
</script>

<style scoped>
/* Your scoped styles */
</style>
