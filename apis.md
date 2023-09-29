Lists

## QUERIES

# /books

    - /books
        example:
            {
                books{
                    name
                }
            }
    - /books/:id
        example:
            query {
                book(id: 2) {
                    name
                }
            }
    # /authors
        example:
            {
                authors{
                    name
                }
            }
    - /authors/:id
        example:
            {
                authors{
                    name
                }
            }

## QUERIES

# /addauthor

    - /addauthor
        example:
            mutation{
                addAuthor(name: "Xiu Ying"){
                    id
                    name
                }
            }
    - /addbook
        example:
            mutation{
                addAuthor(name: "Xiu Ying"){
                    id
                    name
                }
            }


