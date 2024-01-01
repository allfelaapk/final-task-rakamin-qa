import http from 'k6/http';
import { check, group } from 'k6';

export default function () {
  group('Create user with valid request', function () {
    const payload = JSON.stringify({
      name: 'morpheus',
      job: 'leader',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = http.post('https://reqres.in/api/users', payload, params);

    check(res, {
      'response code was 201': (res) => res.status == 201,
      'success insert name: morpheus': (res) => res.body.includes('morpheus'),
      'success insert job: leader': (res) => res.body.includes('leader'),
    });
  });
  group('Update user with valid request', function () {
    const payload = JSON.stringify({
      name: 'morpheus',
      job: 'staff',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = http.put('https://reqres.in/api/users/2', payload, params);

    check(res, {
      'response code was 200': (res) => res.status == 200,
      'verify success get id : 2': (res) => res.body.includes(2),
    });
  });
}
