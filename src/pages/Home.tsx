import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tabs, Progress, Table } from 'antd';
import { default as validatorLib } from 'validator';
import { validateListURL } from '../helpers/validators';
import { getProduct } from '../services/crawler';

const { TabPane } = Tabs;
const { Item } = Form;
const { TextArea } = Input;

type Product = {
    url: string,
}

const Home = () => {
    const [urls, setUrls] = useState<string[]>([]);
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const onLoadProductFromLinks = async (values: any) => {
        const { item } = values;
        const currUrls = item.split(',').map((e: string) => e.trim());
        setLoading(true);
        setUrls(currUrls);
    };

    const onLoadProductFromCategoryLinks = async (values: any) => {
        const { item } = values;
        console.log(item);
        // await getProducts(item);
    };

    const columns = [
        {
            title: 'SKU',
            dataIndex: 'sku',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: (name: string, item: Product) => {
                const { url } = item;
                return <a href={url}>{name}</a>
            }
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
        },
    ]

    useEffect(() => {
        if (urls.length) {
            const curr = urls[0];
            getProduct(curr)
                .then(res => {
                    const newData = data.concat(res);
                    setData(newData);
                })
                .catch(console.log)
                .finally(() => {
                    const newUrls = urls.slice(1);
                    setUrls(newUrls);
                })
        } else {
            setLoading(false);
        }
    }, [urls]);

    return (
        <div className="container mt-5">
            <h2 className="text-center">Lấy thông tin sản phẩm</h2>
            <div className="text-center">Một số web hỗ trợ: HanoiComputer,...</div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Từ link sản phẩm" key="1">
                    <Form className="mt-3" onFinish={onLoadProductFromLinks}>
                        <Item
                            name="item"
                            validateFirst
                            rules={[
                                { required: true, message: 'Vui lòng nhập link!' },
                                { validator: validateListURL },
                            ]}
                            validateTrigger={["onSubmit"]}
                        >
                            <TextArea
                                rows={2}
                                placeholder="Nhập link sản phẩm, ngăn cách bởi dấu phẩy, tối đa 5 link"
                            />
                        </Item>
                        <div className="d-flex justify-content-end">
                            <Button disabled={loading} htmlType="submit" type="primary">Lấy sản phẩm</Button>
                        </div>
                    </Form>
                    {data.length ? (
                        <Table
                            pagination={{
                                pageSize: 5,
                            }}
                            bordered
                            columns={columns}
                            dataSource={data}
                        />
                    ) : null}
                </TabPane>
                <TabPane tab="Từ link danh mục" key="2">
                    <Form className="mt-3" onFinish={onLoadProductFromCategoryLinks}>
                        <Item
                            name="item2"
                            validateFirst
                            rules={[
                                { required: true, message: 'Vui lòng nhập link!' },
                                {
                                    validator: (_, value: string) => {
                                        if (value && !validatorLib.isURL(value)) {
                                            return Promise.reject('Vui lòng nhập đúng định dạng URL');
                                        }
                                        return Promise.resolve();
                                    }
                                },
                            ]}
                        >
                            <Input placeholder="Nhập link danh mục" />
                        </Item>
                        <div className="d-flex justify-content-end">
                            <Button htmlType="submit" type="primary">Lấy sản phẩm</Button>
                        </div>
                    </Form>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default Home;
