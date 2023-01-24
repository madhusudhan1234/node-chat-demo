const axios = require('axios');

describe('GET /messages', () => {
    it('should return an array of messages', (done) => {
        axios.get('http://localhost:3000/messages')
            .then((response) => {
                expect(response.status).toEqual(200);
                expect(Array.isArray(response.data)).toBe(true);
                expect(response.data.length).toBeGreaterThan(0);
                done();
            })
            .catch((error) => {
                console.log(error);
            });
    });
});
