process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

beforeEach(async()=>
{
    const a = await db.query(`DELETE FROM books;`)
    const b = await db.query(`
    INSERT INTO books (isbn, amazon_url, author, language, pages, publisher,title,year)
    VALUES ('123','www.a.b','A B', 'En', '12', 'publisher 1', 'bookTitle', '1994');`)

})

afterAll(async()=>{
    await db.end();
})

describe("post",()=>{
    test("post successfully", async ()=>
    {
        const newBook = {
            "isbn":"124",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        }
        const res = await request(app).post('/books').send(newBook);
        expect(res.statusCode).toBe(201);
        const res2 = await request(app).get('/books');
        expect(res2.body.books.length).toBe(2);
    })
    test("post with missing properties", async ()=>
    {
        const newBook = {
            'isbn':"124",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english"
        }
        const res = await request(app).post('/books').send(newBook);
        expect(res.statusCode).toBe(500);
        const res2 = await request(app).get('/books');
        expect(res2.body.books.length).toBe(1);
    })
    test("post with existing isbn", async ()=>
    {
        const newBook = {
            'isbn':"123",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        }
        const res = await request(app).post('/books').send(newBook);
        expect(res.statusCode).toBe(500);
        const res2 = await request(app).get('/books');
        expect(res2.body.books.length).toBe(1);
    })
})
describe("get",()=>{
    test("get all",async ()=>
    {
        const res = await request(app).get('/books')
        expect(res.statusCode).toBe(200);
        expect(res.body.books.length === 1);
    })

    test("get one",async ()=>
    {
        const res = await request(app).get('/books/123')
        expect(res.statusCode).toBe(200);
        expect(res.body.book.title).toBe('bookTitle');
    })
})



