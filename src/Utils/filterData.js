export const normalize = (text) => text.toLowerCase().replace(/\s+/g, '');

const filterData = (data, searchTerm) => {
  const normalizedSearch = normalize(searchTerm);
  return data.filter((item) =>
    normalize(item.title).includes(normalizedSearch)
  );
};

export default filterData;
