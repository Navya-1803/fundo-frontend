import './SearchBar.css';

// controlled search input shown in the navbar
function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar" role="search">
      <span aria-hidden="true">&#128269;</span>
      <input type="search" placeholder="Search notes" aria-label="Search notes" value={value} onChange={(e) => onChange(e.target.value)} />
      {value && (
        <button type="button" aria-label="Clear search" onClick={() => onChange('')}>
          &#10005;
        </button>
      )}
    </div>
  );
}

export default SearchBar;
