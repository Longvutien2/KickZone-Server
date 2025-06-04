// Trang chủ
export const getHomePage = (req, res) => {
    res.send(`
        <h1>Trang chủ</h1>
        <p>Content trang chủ <p/>
        <img src="https://picsum.photos/2000/400">
    `);
};
