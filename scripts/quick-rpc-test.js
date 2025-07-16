const fetch = require('node-fetch');

async function testRpcWithLongerTimeout() {
    const RPC_NODES = [
        { name: "core1", url: "https://elves-core1.alvey.io/" },
        { name: "core2", url: "https://elves-core2.alvey.io/" },
        { name: "core3", url: "https://elves-core3.alvey.io/" }
    ];

    console.log("🔍 测试RPC节点（长超时）...");
    console.log("=".repeat(50));

    for (const rpc of RPC_NODES) {
        console.log(`\n测试 ${rpc.name}: ${rpc.url}`);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时
            
            const startTime = Date.now();
            
            const response = await fetch(rpc.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_blockNumber',
                    params: [],
                    id: 1
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            const responseTime = Date.now() - startTime;
            
            if (response.ok) {
                const data = await response.json();
                if (data.result) {
                    const blockNumber = parseInt(data.result, 16);
                    console.log(`  ✅ 成功! 响应时间: ${responseTime}ms, 区块: ${blockNumber}`);
                } else {
                    console.log(`  ❌ 无效响应: ${JSON.stringify(data)}`);
                }
            } else {
                console.log(`  ❌ HTTP错误: ${response.status} ${response.statusText}`);
            }
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`  ❌ 连接超时 (>15秒)`);
            } else {
                console.log(`  ❌ 连接失败: ${error.message}`);
            }
        }
    }
    
    console.log("\n🔍 测试其他可能的RPC节点...");
    
    // 尝试其他可能的RPC
    const alternativeRpcs = [
        { name: "direct-ip", url: "https://18.142.54.137:8545/" },
        { name: "backup-1", url: "https://rpc.alvey.io/" },
        { name: "backup-2", url: "https://alvey-rpc.com/" }
    ];
    
    for (const rpc of alternativeRpcs) {
        console.log(`\n测试备用 ${rpc.name}: ${rpc.url}`);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const startTime = Date.now();
            
            const response = await fetch(rpc.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_blockNumber',
                    params: [],
                    id: 1
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            const responseTime = Date.now() - startTime;
            
            if (response.ok) {
                const data = await response.json();
                console.log(`  ✅ 备用节点可用! 响应时间: ${responseTime}ms`);
            } else {
                console.log(`  ❌ HTTP错误: ${response.status}`);
            }
            
        } catch (error) {
            console.log(`  ❌ 备用节点失败: ${error.message}`);
        }
    }
}

testRpcWithLongerTimeout()
    .then(() => console.log("\n🎉 RPC测试完成"))
    .catch(error => console.error("�� 测试失败:", error)); 