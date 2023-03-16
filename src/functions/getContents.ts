import glob from 'tiny-glob';

/**
 * fetches all file contents in a path
 * @param {string} path path to search
 * @returns {Promise<Array<unknown>>} list of files in path
 */
export async function getContents(path: string): Promise<Array<unknown>> {
  const files = await glob(`${path}/**/*.{ts,js}`);

  const contents = await Promise.all(
    files.map((path) => import(`../../${path}`))
  );

  return contents;
}
