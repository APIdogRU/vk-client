# APIdog Mini VK Client for Node
## Using
Install:
```bash
npm i @apidog/vk-client
```

Import:
```ts
import VK from '@apidog/vk-client';
```

Create instance of client:
```ts
const vk = new VK('abcdef0123456');
```

Make request:
```ts
const [durov] = await vk.perform<IUser[]>('users.get', {
    userIds: 1,
    fields: ['photo_50', 'first_name_dat'],
    // 'userIds' converts to 'user_ids'
    // arrays in value converts to comma-separated string
});

// or
vk.perform<IUser[]>('users.get', {
    userIds: [1],
}).then(([durov]) => {
    // ...
});

```
