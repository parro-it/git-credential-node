import { fill } from 'git-credential-helper';

export default async function gsw() {
  return new Promise( (resolve, reject) => {
    fill('github.com', (err, data)=> {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    }, { silent: true });
  });
}
