import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tabs, Progress, Table, Badge, Avatar } from 'antd';
import { default as validatorLib } from 'validator';
import { validateListURL } from '../helpers/validators';
import { getProduct } from '../services/crawler';

const { TabPane } = Tabs;
const { Item } = Form;
const { TextArea } = Input;

type Product = {
    url: string,
}

type Tracking = {
    total: number,
    success: number,
}

const Home = () => {
    const [urls, setUrls] = useState<string[]>([]);
    const [currentTotal, setCurrentTotal] = useState<number>(0);
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [track, setTrack] = useState<Tracking>({
        total: 0,
        success: 0,
    })

    const onLoadProductFromLinks = async (values: any) => {
        setCurrentTotal(0);
        const { item } = values;
        const currUrls = item.trim().split(/\r?\n/).map((e: string) => e.trim());
        setLoading(true);
        setCurrentTotal(currUrls.length);
        setUrls(currUrls);
    };

    const onLoadProductFromCategoryLinks = async (values: any) => {
        const { item } = values;
        console.log(item);
        // await getProducts(item);
    };

    const getPercent = () => {
        return 100 * (currentTotal - urls.length) / currentTotal;
    }

    const columns = [
        {
            title: 'Image',
            dataIndex: 'images',
            render: (images: string[]) => {
                if (images && images.length) {
                    return (
                        <Badge count={images.length}>
                            <Avatar size={64} shape="square" src={images[0]} />
                        </Badge>
                    )
                }
                return null;
            },
        },
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
            const newTrack = {...track};
            getProduct(curr)
                .then(res => {
                    newTrack.success = newTrack.success + 1;
                    const newData = data.concat(res);
                    setData(newData);
                })
                .catch(console.log)
                .finally(() => {
                    newTrack.total = newTrack.total + 1;
                    const newUrls = urls.slice(1);
                    setTrack(newTrack)
                    setUrls(newUrls);
                })
        } else {
            setLoading(false);
        }
    }, [urls]);

    return (
        <div className="container mt-5">
            <h2 className="text-center">Lấy thông tin sản phẩm</h2>
            <div className="text-center">Website hỗ trợ: HanoiComputer</div>
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
                                rows={4}
                                placeholder="Nhập link sản phẩm, mỗi link một dòng"
                            />
                        </Item>
                        <div className="d-flex justify-content-end">
                            <Button disabled={loading} htmlType="submit" type="primary">Lấy sản phẩm</Button>
                        </div>
                    </Form>
                    <strong className="d-block">
                        <span className="text-muted">Total: {track.total}</span>
                        {' - '}
                        <span className="text-success">Success: {track.success}</span>
                        {' - '}
                        <span className="text-danger">Error: {track.total - track.success}</span>
                    </strong>
                    <Progress percent={currentTotal !== 0 ? getPercent() : 0} status={loading ? 'active' : undefined} />
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
