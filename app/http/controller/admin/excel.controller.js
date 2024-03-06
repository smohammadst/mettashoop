const Controller = require("../controller");
const path = require('path');
const { ProductModel } = require("../../../model/products");
const XLSX = require('xlsx');
const createHttpError = require("http-errors");
const MelipayamakApi = require('melipayamak');
const username = '09353040700';
const password = 'cahefm';
const api = new MelipayamakApi(username, password);
const axios = require('axios');
const cheerio = require('cheerio');

function filePathExcel(filename) {
    let filePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "public",
        "uploads",
        "xcel",
        filename
    );
    return filePath
}

class ExcelController extends Controller {
    pad(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }
    createExcel(filename, listProducts, res) {
        const workbook = XLSX.utils.book_new();
        const categorizedProducts = {};
        listProducts.forEach(product => {
            if (!categorizedProducts[product.category]) {
                categorizedProducts[product.category] = [];
            }
            categorizedProducts[product.category].push(product);
        });

        // برای هر دسته بندی، یک شیت جدید ایجاد کنید
        for (const category in categorizedProducts) {
            if (categorizedProducts.hasOwnProperty(category)) {
                const products = categorizedProducts[category];

                // ایجاد شیت جدید با استفاده از دسته بندی محصولات به عنوان نام شیت
                const worksheet = XLSX.utils.json_to_sheet(products);

                // اضافه کردن شیت به کتابچه اکسل
                XLSX.utils.book_append_sheet(workbook, worksheet, category);
            }
        }
        const filePath = filePathExcel(filename)
        XLSX.writeFile(workbook, filePath, { bookType: 'xlsx', bookSST: false, type: 'binary' });
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('خطا در ارسال فایل:', err);
            } else {
                console.log('فایل با موفقیت ارسال شد.');
            }
        });
    }
    async filterProductByCategory(res) {
        const products = await ProductModel.find().sort({ category: -1 });
        let listProducts = [];
        for (var i = 0; i < products.length; i++) {
            let price = "" + products[i].price;
            price = price.replace(/0+$/, "");
            let theFinalPrice = "" + products[i].theFinalPrice;
            theFinalPrice = theFinalPrice.replace(/0+$/, "");
            let colors = products[i].ImportantFeatures?.colors;
            let maliat = "" + products[i].maliat;
            maliat = maliat.replace(/000$/, "");
            let result = maliat + products[i].theFinalPrice
            colors = colors.join(" ");
            theFinalPrice = theFinalPrice.replace(/0+$/, "");
            listProducts.push(
                {
                    id: products[i].id,
                    title: products[i].title, price: price,
                    theFinalPrice: theFinalPrice, barcode: products[i].barcode,
                    category: products[i].category,
                    colors,
                    maliat,
                    result,
                    notification: products[i].notification,
                    numberNotification: products[i].list_notification.length
                }
            )
        }
        const filename = `products.xlsx`
        this.createExcel(filename, listProducts, res);
    }
    getAllProductExcel(req, res, next) {
        this.filterProductByCategory(res)
    }
    async fileExcelUploadAndUpdatePrice(req, res, next) {
        try {
            let filePath = path.join(
                __dirname,
                "..",
                "..",
                "..",
                "..",
                "public",
                "uploads",
                "xcel",
                "changePrice.xlsx"
            );
            const workbook = XLSX.readFile(filePath);
            const sheets = {};
            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                sheets[sheetName] = data;
            });
            let output = [];
            for (const sheetName in sheets) {
                if (sheets.hasOwnProperty(sheetName)) {
                    const sheetData = sheets[sheetName];
                    let products = sheetData.map(row => ({
                        id: row[0],
                        title: row[1],
                        price: row[2],
                        theFinalPrice: row[3],
                        barcode: row[4],
                        category: row[5],
                        colors: row[6],
                        maliat: row[7],
                        result: row[8],
                        notification: row[9],
                        list_notification: row[10]
                    }));
                    products.forEach((e, index) => {
                        if (e.id == "id") products.shift(index)
                    })
                    output.push(...products);
                }
            }
            for (var i = 0; i < output.length; i++) {
                const barcode = output[i].barcode;
                let discount = output[i].theFinalPrice;
                let id = output[i].id
                discount = +discount
                if (discount == 0) discount = 0
                else {
                    discount = "" + discount + "000"
                    discount = +discount
                }
                let price = output[i].price;
                price = +price
                if (price == 0) price = 0
                else {
                    price = "" + price + "000"
                    price = +price
                }
                const category = output[i].category;
                let productID = output[i].productID;
                productID = "" + productID
                const title = output[i].title
                let colors = output[i].colors;
                colors = colors.split(" ");
                let maliat = output[i].maliat;
                if (maliat == 0) maliat = 0
                else {
                    maliat = "" + maliat + "000"
                    maliat = +maliat
                }
                const product = await ProductModel.findOne({ _id: id })
                if (!product)
                    throw createHttpError.NotFound("محصولی یافت نشد برای تغییر قیمت");
                if (title == "DELETE") {
                    await product.delete()
                }
                if (output[i].notification == "TRUE") {
                    await ProductModel.updateOne({ _id: id }, { $set: { notification: true } });
                }
                if (output[i].notification == false && output[i].list_notification > 0) {
                    const listPhone = product.list_notification;
                    for (let i = 0; i < listPhone.length; i++) {
                        const sms = api.sms()
                        const to = "" + listPhone[i].phone;
                        const from = "50004001040700";
                        let text = `
                        با سلام.
                        محصول ${product.title} موجود شد داخل سایت
                        `
                        sms.send(to, from, text).then(e => {
                            console.log(e)
                        }).catch(err => {
                            console.log("err" + err)
                        });
                    }
                    await ProductModel.updateOne({ _id: id }, { $set: { list_notification: [] } });
                }
                if (price && (!discount || discount == 0)) {
                    await ProductModel.updateOne({ _id: id }, { $set: { price, theFinalPrice: price, discount: 0, count: 100, barcode, title, "ImportantFeatures.colors": colors, "features.colors": colors, maliat: maliat } });
                } else if (!price && !discount) {
                    await ProductModel.updateOne({ _id: id }, { $set: { price: 0, count: 0, theFinalPrice: 0, barcode, title, "ImportantFeatures.colors": colors, "features.colors": colors, maliat: maliat } });
                } else {
                    let mines = price - discount;
                    let discountPercent = (mines * 100) / price;
                    let final = Math.floor(discountPercent);
                    discountPercent = Math.floor(discountPercent)
                    await ProductModel.updateOne({ _id: id }, { $set: { price, theFinalPrice: discount, discount: discountPercent, count: 100, productID, title, "ImportantFeatures.colors": colors, "features.colors": colors, maliat: maliat } });
                }
            }
            return res.status(200).json({
                data: 200
            })
        } catch (error) {
            next(error)
        }
    }
}
module.exports = {
    ExcelController: new ExcelController(),
};