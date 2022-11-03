import http from '../../core/services/http-common';

export class TrucksApiService {
    getAll() {
        return http.get('/posts');
    }

    getPopular() {
        return http.get('/posts?_sort=views&_order=desc&_limit=3');
    }
    get(id) {
        return http.get(`/posts/${id}`);
    }

    create(data) {
        return http.post('/posts', data);
    }

    update(id, data) {
        return http.put(`/posts/${id}`, data);
    }

    delete(id) {
        return http.delete(`/posts/${id}`);
    }

    deleteAll() {
        return http.delete(`/posts`);
    }

    findByTitle(title) {
        return http.get(`/posts?title=${title}`);
    }
}