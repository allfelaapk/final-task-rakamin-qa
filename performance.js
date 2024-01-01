import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
  vus: 1000,
  iterations: 3500,
  // duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http error harus kurang dari 1%
    http_req_duration: ['p(95)<2000'], // 95% pada request harus dibawah 2000ms
  },
};

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
    sleep(1);
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
    sleep(1);
  });
}

export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
  };
}
