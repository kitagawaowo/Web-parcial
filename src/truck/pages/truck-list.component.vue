<template>
  <h1>Most popular</h1>
  <pv-card style="width: 20em; margin-top: 1.5em" v-for="(post, i) in populars" :key="i">
    <template #header>
      <img :src="post.photoUrl" style="height: 15rem"/>
    </template>
    <template #title>
      <h3>#{{ i + 1 }}</h3>
      <h3>{{ post.title }}</h3>
    </template>
    <template #footer>
      <h4>Views: {{ post.views}}</h4>
      <h4>Likes: {{ post.likes }}</h4>
    </template>
  </pv-card>
  <h1>More posts</h1>
  <pv-card style="width: 20em; margin-top: 1.5em" v-for="(post, i) in tutorials" :key="i">
    <template #header>
      <img :src="post.photoUrl" style="height: 15rem"/>
    </template>
    <template #title>
      <h3>#{{ i + 1 }}</h3>
      <h3>{{ post.title }}</h3>
    </template>
    <template #footer>
      <h4>Views: {{ post.views}}</h4>
      <h4>Likes: {{ post.likes }}</h4>
    </template>
  </pv-card>
</template>
<script>
import { TrucksApiService} from "../services/trucks-api.service";
import { FilterMatchMode } from "primevue/api";

export default {
  name: "tutorial-list",
  data() {
    return {
      tutorials: [],
      populars: [],
      tutorialDialog: false,
      deleteTutorialDialog: false,
      deleteTutorialsDialog: false,
      tutorial: {},
      selectedTutorials: null,
      filters: {},
      submitted: false,
      statuses: [
        { label: "Published", value: "published" },
        { label: "Unpublished", value: "unpublished" },
      ],
      tutorialsService: null,
    };
  },
  created() {
    this.tutorialsService = new TrucksApiService();
    this.tutorialsService.getAll().then((response) => {
      this.tutorials = response.data;
      console.log(this.tutorials);
      this.tutorials.forEach((tutorial) =>
          this.getDisplayableTutorial(tutorial)
      );
      console.log(this.tutorials);
    });
    this.tutorialsService.getPopular().then((response) => {
      this.populars = response.data;
      console.log(this.populars);
      this.populars.forEach((popular) =>
          this.getDisplayableTutorial(popular)
      );
      console.log(this.populars);
    });
    this.initFilters();
  },

  methods: {
    getDisplayableTutorial(tutorial) {
      tutorial.status = tutorial.published
          ? this.statuses[0].label
          : this.statuses[1].label;
      return tutorial;
    },
    getStorableTutorial(displayableTutorial) {
      return {
        id: displayableTutorial.id,
        title: displayableTutorial.title,
        description: displayableTutorial.description,
        published: displayableTutorial.status.label === "Published",
      };
    },
    openNew() {
      this.tutorial = {};
      this.submitted = false;
      this.tutorialDialog = true;
    },
    hideDialog() {
      this.tutorialDialog = false;
      this.submitted = false;
    },
    findIndexById(id) {
      console.log(`current id: ${id}`);
      return this.tutorials.findIndex((tutorial) => tutorial.id === id);
    },
    saveTutorial() {
      this.submitted = true;
      if (this.tutorial.title.trim()) {
        if (this.tutorial.id) {
          console.log(this.tutorial);
          this.tutorial = this.getStorableTutorial(this.tutorial);
          this.tutorialsService
              .update(this.tutorial.id, this.tutorial)
              .then((response) => {
                console.log(response.data.id);
                this.tutorials[this.findIndexById(response.data.id)] =
                    this.getDisplayableTutorial(response.data);
                this.$toast.add({
                  severity: "success",
                  summary: "Successful",
                  detail: "Tutorial Updated",
                  life: 3000,
                });
                console.log(response);
              });
        } else {
          this.tutorial.id = 0;
          console.log(this.tutorial);
          this.tutorial = this.getStorableTutorial(this.tutorial);
          this.tutorialsService.create(this.tutorial).then((response) => {
            this.tutorial = this.getDisplayableTutorial(response.data);
            this.tutorials.push(this.tutorial);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Tutorial Created",
              life: 3000,
            });
            console.log(response);
          });
        }
        this.tutorialDialog = false;
        this.tutorial = {};
      }
    },
    editTutorial(tutorial) {
      console.log(tutorial);
      this.tutorial = { ...tutorial };
      console.log(this.tutorial);
      this.tutorialDialog = true;
    },
    confirmDeleteTutorial(tutorial) {
      this.tutorial = tutorial;
      this.deleteTutorialDialog = true;
    },
    deleteTutorial() {
      this.tutorialsService.delete(this.tutorial.id).then((response) => {
        this.tutorials = this.tutorials.filter(
            (t) => t.id !== this.tutorial.id
        );
        this.deleteTutorialsDialog = false;
        this.tutorial = {};
        this.$toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Tutorial Deleted",
          life: 3000,
        });
        console.log(response);
      });
    },
    exportToCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteTutorialsDialog = true;
    },
    deleteSelectedTutorials() {
      this.selectedTutorials.forEach((tutorial) => {
        this.tutorialsService.delete(tutorial.id).then((response) => {
          this.tutorials = this.tutorials.filter(
              (t) => t.id !== this.tutorial.id
          );
          console.log(response);
        });
      });
      this.deleteTutorialsDialog = false;
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 960px) {
    align-items: start;
  }
}
.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 960px) {
  ::v-deep(.p-toolbar) {
    flex-wrap: wrap;
    .p-button {
      margin-bottom: 0.25rem;
    }
  }
}
</style>

