function BookCard(props){
    return (
        <div>
            <h2>Title: {props.title}</h2>
            <h2>Author: {props.author}</h2>
            <h2>Published Year: {props.published_year}</h2>
        </div>
        
    );
}
export default BookCard;