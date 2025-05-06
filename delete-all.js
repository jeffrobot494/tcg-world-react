const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dmfjx6e7z',
  api_key: '298828572186194',
  api_secret: 'j5JrldVYYWtEIzHK7awsy0KOmdg'
});

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function deleteAllAssets(nextCursor = null) {
  try {
    const result = await cloudinary.api.resources({
      max_results: 500,
      next_cursor: nextCursor
    });

    const publicIds = result.resources.map(asset => asset.public_id);
    const batches = chunkArray(publicIds, 100);

    for (const batch of batches) {
      const res = await cloudinary.api.delete_resources(batch);
      console.log(`Deleted batch of ${batch.length}`);
    }

    if (result.next_cursor) {
      await deleteAllAssets(result.next_cursor);
    } else {
      console.log('All assets deleted.');
    }
  } catch (err) {
    console.error('Error during deletion:', err);
  }
}


deleteAllAssets();
